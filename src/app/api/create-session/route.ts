"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { CreateSession } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
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

  const payload = {
    _token: data?._token,
    _id: data._id,
    action: "/",
    method: "GET",
    cookies: data?.state,
  };

  const response = await CreateSession(payload as IPayload);
  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "Session Created Successfully!",
    data: response,
  });
});
