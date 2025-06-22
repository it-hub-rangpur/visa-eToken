"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { PaymentOTP } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { paymentOtpPayload } from "@/utils/payloads";
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

  const info = paymentOtpPayload(data._token, data?.resend as number);

  const payload = {
    _id: data._id,
    action: "/pay-otp-sent",
    method: "POST",
    cookies: data?.state,
    info,
  };

  const response = await PaymentOTP(payload as IPayload);

  return sendResponse({
    statusCode: httpStatus.OK,
    success: response?.resend > (data?.resend as number),
    message: response?.message,
    data: response,
  });
});
