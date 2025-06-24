"use server";

import { IPayload } from "@/interfaces";
import ApiError from "@/utils/ErrorHandelars/ApiError";
import GetSessionInfo from "@/utils/server/GetSessionInfo";
import { abortRequests, raceRequests } from "@/utils/server/RequestManager";
import { SessionSteps } from "@/utils/server/sessionWithStep";
import httpStatus from "http-status";

export const CreateSession = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const htmlText = await response.text();

  const cookies = response?.headers?.getSetCookie();
  const sessionInfo = GetSessionInfo(htmlText);
  const info = {
    ...sessionInfo,
    cookies,
    action: sessionInfo?.isLoggedin
      ? SessionSteps?.APPLICATION_INFO
      : SessionSteps?.SESSION_CREATED,
  };

  return info;
};

export const AbortCall = async (data: { _id: string }) => {
  abortRequests(data?._id);
  return {
    message: "Abort Successfully!",
  };
};

export const DoLogin = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const htmlText = await response.text();

  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");

  const sessionInfo = GetSessionInfo(htmlText);
  const info = {
    ...sessionInfo,
    action: SessionSteps?.LOGIN_SUCCESSFUL,
    cookies,
    path:
      redirectPath === "https://payment.ivacbd.com/iv-admin" ? "/" : "/login",
  };

  return info;
};

export const ApplicationInfo = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;

  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");
  const path =
    redirectPath === "https://payment.ivacbd.com/personal-info"
      ? "/personal-info"
      : "/";

  const info = {
    success: path !== "/",
    message:
      path !== "/"
        ? "Application info submitted!"
        : "Session not found or invalid",
    action:
      path !== "/"
        ? SessionSteps?.PERSONAL_INFO
        : SessionSteps?.APPLICATION_INFO,
    cookies,
    path,
  };

  return info;
};

export const PersonalInfo = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;

  const cookies = response?.headers?.getSetCookie();
  // const redirectPath = response?.headers?.get("Location");
  // const path =
  //   redirectPath === "https://payment.ivacbd.com/overview" ? "/overview" : "/";
  const info = {
    success: true,
    message: "Personal info submitted!",
    action: SessionSteps?.OVERVIEW,
    cookies,
    path: "/overview",
  };

  return info;
};

export const OverviewInfo = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;

  const cookies = response?.headers?.getSetCookie();
  // const redirectPath = response?.headers?.get("Location");
  // const path =
  //   redirectPath === "https://payment.ivacbd.com/payment" ? "/payment" : "/";

  // console.log("redirectPath", redirectPath);
  const info = {
    success: true,
    message: "Overview info submitted!",
    action: SessionSteps?.PAYMENTOTP,
    cookies,
    resend: 0,
    path: "/payment",
  };

  return info;
};

export const PaymentOTP = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");

  console.log("redirectPath", redirectPath);

  if (redirectPath) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session not found or invalid!");
  }

  const data = await response.json();

  // const data = {
  //   success: false,
  //   message: {
  //     error: "Slot is not available",
  //   },
  // };

  // console.log("payload", payload);

  // const data = {
  //   success: true,
  //   message: "Sms send successfully",
  // };
  // console.log(payload?.action, data);
  // /pay-otp-sent { success: true, message: 'Sms send successfully' }
  if (data?.success && data?.message === "Sms send successfully") {
    const info = {
      action: SessionSteps?.PAYMENTOTP,
      message: data?.message,
      cookies,
      resend: (payload?.info?.resend as number) + 1,
      path: "/pay-otp-sent",
    };
    return info;
  } else {
    const errMessage =
      typeof data?.message === "string"
        ? data?.message
        : data?.message?.error ?? "Fail to send OTP!";

    const info = {
      action: SessionSteps?.PAYMENTOTP,
      message: errMessage,
      cookies: [],
      resend: 0,
      path: "/pay-otp-sent",
    };
    if (errMessage === "Slot is not available") {
      info.message = "Slot is not available!";
    }
    return info;
  }
};

export const VerifyOTP = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");

  console.log("redirectPath", redirectPath);

  if (redirectPath) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session Not Found!");
  }

  const data = await response.json();
  console.log(payload?.action, data);

  // const data = {
  //   success: true,
  //   message: "OTP verified successfully",
  //   data: {
  //     slot_times: [],
  //     slot_dates: ["2025-06-25"],
  //     status: true,
  //     error_reason: "",
  //   },
  // };
  // const data = {
  //   success: true,
  //   message: "",
  //   data: {
  //     slot_times: [],
  //     slot_dates: ["2025-06-25"],
  //     status: true,
  //     error_reason: "",
  //   },
  // };
  // data {
  //   success: true,
  //   message: '',
  //   data: {
  //     slot_times: [],
  //     slot_dates: [ '2025-06-23' ],
  //     status: true,
  //     error_reason: ''
  //   }
  // }

  const info = {
    success: data?.success,
    action: SessionSteps?.VERIFYPAYMENTOTP,
    message: data?.message ?? "OTP verified fail!",
    cookies,
    slot_dates: [] as string[],
    resend: 0,
    path: payload?.action,
  };

  if (data?.success) {
    info.slot_dates = data?.data?.slot_dates;
    info.message = "OTP verified successfully!";
  } else {
    const errorMessage =
      typeof data?.message === "string"
        ? data?.message
        : data?.message?.error ?? "Fail to verify OTP!";
    info.message = errorMessage;
  }
  return info;
};

export const GetTimeSlot = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");

  console.log("redirectPath", redirectPath);

  if (redirectPath) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session Not Found!");
  }

  const data = await response.json();

  console.log("data", data);

  // const data = {
  //   success: true,
  //   message: "",
  //   data: {
  //     slot_times: [{ hour: 9 }],
  //     slot_dates: ["2025-06-25"],
  //     status: true,
  //     error_reason: "",
  //   },
  // };

  // "slot_times": [
  //           {
  //               "id": 228573,
  //               "ivac_id": 2,
  //               "visa_type": 6,
  //               "hour": 9,
  //               "date": "2025-06-25",
  //               "availableSlot": 13,
  //               "time_display": "09:00 - 09:59"
  //           }
  //       ],

  const info = {
    action: SessionSteps?.GETTIMESLOT,
    message: "",
    success: data?.success,
    cookies,
    slot_times: [] as { hour: number }[],
    resend: 0,
    path: payload?.action,
  };

  if (data?.success) {
    info.message = `Slot time fetched successfully! - (${data?.data?.slot_times[0]?.availableSlot})`;
    info.slot_times = data?.data?.slot_times as { hour: number }[];
  } else {
    info.message = data?.message ?? "Fail to fetch slot time!";
  }
  return info;
};
export const BookNow = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");

  console.log("redirectPath", redirectPath);

  if (redirectPath) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session Not Found!");
  }

  const data = await response.json();

  const info = {
    action: SessionSteps?.VERIFYPAYMENTOTP,
    message: data?.message,
    cookies,
    slot_dates: [],
    resend: 0,
    path: "/verify-otp",
  };

  console.log("data", data);
  // data {
  //   success: true,
  //   message: '',
  //   data: {
  //     slot_times: [],
  //     slot_dates: [ '2025-06-23' ],
  //     status: true,
  //     error_reason: ''
  //   }
  // }

  if (data?.success) {
    info.slot_dates = data?.slot_dates;
    return info;
  } else {
    const errorMessage =
      typeof data?.message === "string"
        ? data?.message
        : data?.message?.error ?? "Fail to verify OTP!";
    info.message = errorMessage;
    return info;
  }
};
