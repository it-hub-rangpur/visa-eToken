import { Agent, fetch } from "undici";
import ApiError from "../ErrorHandelars/ApiError";

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

export async function raceRequests(
  url: string,
  applicationId: string,
  concurrency: number = 5,
  maxDelayMs: number = 9
) {
  const controllers = Array.from(
    { length: concurrency },
    () => new AbortController()
  );
  const timeouts: NodeJS.Timeout[] = [];

  return new Promise((resolve, reject) => {
    // Initialize state with optional reject function
    requestMap.set(applicationId, {
      isCompleted: false,
      controllers,
      timeouts,
      reject,
    });

    let hasSuccess = false;
    let completedCount = 0;

    const cleanup = (completed: boolean) => {
      const tracker = requestMap.get(applicationId);
      if (tracker) {
        tracker.isCompleted = completed;
        timeouts.forEach((timeout) => clearTimeout(timeout));
        // Remove reject reference if it exists
        if (tracker.reject) {
          delete tracker.reject;
        }
        if (completed) {
          requestMap.delete(applicationId);
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
      const response = await fetch(url, {
        dispatcher: httpsAgent,
        signal: controller.signal,
      });

      // Check if we should retry
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
          if (response?.ok && !hasSuccess) {
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
          checkCompletion();
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

export function abortRequests(applicationId: string): boolean {
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
  return false;
}
