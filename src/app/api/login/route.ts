"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { DoLogin } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { getWithoutOtpPayload } from "@/utils/payloads";
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

  const info = getWithoutOtpPayload(data._token, application);

  const payload = {
    _token: data?._token,
    _id: data._id,
    action: "/dologin",
    method: "POST",
    cookies: data?.state,
    info,
  };

  const response = await DoLogin(payload as IPayload);

  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "Login Successfully!",
    data: response,
  });
});
