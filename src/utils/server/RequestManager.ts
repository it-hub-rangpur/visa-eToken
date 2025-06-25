import { Agent, fetch } from "undici";
import ApiError from "../ErrorHandelars/ApiError";
import { IPayload } from "@/interfaces";

const multipleCall =
  Number(process.env.NEXT_PUBLIC_API_MULTIPLE_CALL ?? "10") ?? 1;

export function createHeaders(state: string[]): Headers {
  const headers = new Headers();
  headers.set("accept-language", "en-US,en;q=0.9");
  headers.set("Accept", "application/x-www-form-urlencoded;charset=UTF-8");
  headers.set(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8"
  );

  if (state?.length) {
    const cookies = state.join("; ");
    if (cookies) headers.set("Cookie", cookies);
  }
  return headers;
}

const url = "https://payment.ivacbd.com";

const httpsAgent = new Agent({
  keepAliveTimeout: 300000,
  keepAliveMaxTimeout: 1800000,
  connections: 100,
  pipelining: 10,
});

type RequestState = {
  isCompleted: boolean;
  controllers: AbortController[];
  timeouts: NodeJS.Timeout[];
  reject?: (reason?: unknown) => void; // Make reject optional in type
};

const requestMap = new Map<string, RequestState>();

// Status codes that should trigger a retry
const RETRY_STATUS_CODES = [500, 502, 504];
const ERROR_STATUS_CODES = [429];
const SUCCESS_STATUS_CODES = [200, 301, 302];

export async function raceRequests(
  payload: IPayload,
  concurrency: number = multipleCall,
  maxDelayMs: number = 9
) {
  const { _id, action, cookies, method, info } = payload;
  const headers = createHeaders(cookies);

  const controllers = Array.from(
    { length: action === "/pay-otp-sent" ? 1 : concurrency },
    () => new AbortController()
  );
  const timeouts: NodeJS.Timeout[] = [];

  return new Promise((resolve, reject) => {
    requestMap.set(_id, {
      isCompleted: false,
      controllers,
      timeouts,
      reject,
    });
    let hasSuccess = false;
    let completedCount = 0;
    const cleanup = (completed: boolean) => {
      const tracker = requestMap.get(_id);
      if (tracker) {
        tracker.isCompleted = completed;
        timeouts.forEach((timeout) => clearTimeout(timeout));
        // Remove reject reference if it exists
        if (tracker.reject) {
          delete tracker.reject;
        }
        if (completed) {
          requestMap.delete(_id);
        }
      }
    };
    const makeRequestWithRetry = async (
      controller: AbortController,
      attempt = 0
    ) => {
      if (hasSuccess || controller.signal.aborted) {
        return null;
      }

      const response = await fetch(url + action, {
        dispatcher: httpsAgent,
        method,
        headers,
        body:
          method !== "GET"
            ? new URLSearchParams(info as Record<string, string>)
            : undefined,
        redirect: "manual",
        signal: controller.signal,
      });

      console.log(response?.status, "-", response?.statusText);

      if (RETRY_STATUS_CODES.includes(response.status)) {
        console.log(
          `Retrying request (attempt ${attempt + 1}) for status ${
            response.status
          }`
        );
        return makeRequestWithRetry(controller, attempt + 1);
      } else if (ERROR_STATUS_CODES.includes(response.status)) {
        reject(new ApiError(429, "Too many requests"));
      }
      return response;
    };
    controllers.forEach((controller, i) => {
      const delay = i === 0 ? 0 : Math.floor(Math.random() * maxDelayMs);
      const timeout = setTimeout(async () => {
        if (hasSuccess || controller.signal.aborted) {
          completedCount++;
          checkCompletion();
          return;
        }
        try {
          const response = await makeRequestWithRetry(controller);
          if (
            SUCCESS_STATUS_CODES?.includes(response?.status as number) &&
            !hasSuccess
          ) {
            hasSuccess = true;
            cleanup(true);
            resolve(response);
            // Abort other requests
            controllers.forEach((c) => c !== controller && c.abort());
          } else if (response?.status === 429) {
            reject(new ApiError(429, "Too many requests"));
          }
        } catch (error) {
          console.error(`Request ${i} failed after retries:`, error);
        } finally {
          completedCount++;
          // checkCompletion();
        }
      }, delay);
      timeouts.push(timeout);
    });
    const checkCompletion = () => {
      if (!hasSuccess && completedCount === concurrency) {
        cleanup(true);
        reject(new Error("All requests failed after retries"));
      }
    };
  });
}

export async function abortRequests(applicationId: string) {
  const tracker = requestMap.get(applicationId);
  if (tracker && !tracker.isCompleted) {
    console.log(`Aborting requests for application: ${applicationId}`);
    // Abort all controllers
    tracker.controllers.forEach((controller) => controller.abort());
    // Clear all timeouts
    tracker.timeouts.forEach((timeout) => clearTimeout(timeout));
    // Reject the promise if reject function exists
    if (tracker.reject) {
      tracker.reject(new Error("Request was aborted by user"));
    }
    // Mark as completed
    tracker.isCompleted = true;
    requestMap.delete(applicationId);
    return true;
  }
  console.log(`No active requests found for application: ${applicationId}`);
}
