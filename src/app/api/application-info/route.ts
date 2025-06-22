"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { ApplicationInfo } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import ApiError from "@/utils/ErrorHandelars/ApiError";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { applicationInfoPayload } from "@/utils/payloads";
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

  if (currentSession <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Session Not Found!");
  }

  const info = applicationInfoPayload(data._token, application);

  const payload = {
    _id: data._id,
    action: "/application-info-submit",
    method: "POST",
    cookies: data?.state,
    info,
  };

  const response = await ApplicationInfo(payload as IPayload);
  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "Application info submitted!",
    data: response,
  });
});
