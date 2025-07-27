"use server";

import { IPayload } from "@/interfaces";
import { OrderConfirm } from "@/server/ApplicationService";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

export const POST = catchAsync(async (req: Request): Promise<NextResponse> => {
  const requestBody = await req.json();

  const payload = {
    _token: requestBody._token,
    _id: requestBody._id,
    action: "/api/payment/appointment/process",
    cookies: requestBody?.state,
    method: "POST",
    info: { ...requestBody, value_a: "BGDDV1A82625,BGDDV1A8BE25,BGDDV1A88A25" },
  };

  const response = await OrderConfirm(payload as IPayload);

  return sendResponse({
    statusCode: httpStatus.OK,
    success: response?.success,
    message: response?.success
      ? "Order Confirm Successfully!"
      : "Order Confirm Failed!",
    data: response,
  });
});
