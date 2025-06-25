"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { IApplication } from "@/lib/apis/Application/ApplicationSlice";
import { PersonalInfo } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import ApiError from "@/utils/ErrorHandelars/ApiError";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { personalInfoPayload } from "@/utils/payloads";
import { getCurrentSession, SessionStep } from "@/utils/server/sessionWithStep";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

export const POST = catchAsync(async (req: Request): Promise<NextResponse> => {
  const requestBody = await req.json();
  const data: IProcessRequest = requestBody;
  const application = await getById(data._id);

  if (!application) {
    return sendResponse({
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Application Not Found!",
      data: null,
    });
  }

  const currentSession = getCurrentSession(data?.action as SessionStep);

  if (currentSession < 4) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session not found or invalid!");
  }

  const info = personalInfoPayload(data._token, application as IApplication);

  const payload = {
    _id: data._id,
    action: "/personal-info-submit",
    method: "POST",
    cookies: data?.state,
    info,
  };

  const response = await PersonalInfo(payload as IPayload);
  return sendResponse({
    statusCode: httpStatus.OK,
    success: response?.success,
    message: response?.message,
    data: response,
  });
});
