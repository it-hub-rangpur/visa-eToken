"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { VerifyOTP } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { verifyOtpPayload } from "@/utils/payloads";
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

  const info = verifyOtpPayload(data._token, data?.otp as string);

  const payload = {
    _id: data._id,
    action: "/pay-otp-verify",
    method: "POST",
    cookies: data?.state,
    info,
  };

  const response = await VerifyOTP(payload as IPayload);
  return sendResponse({
    statusCode: httpStatus.OK,
    success: response?.slot_dates?.length > 0 ? true : false,
    message: response?.message,
    data: response,
  });
});
