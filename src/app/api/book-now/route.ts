"use server";

import { IPayload, IProcessRequest } from "@/interfaces";
import { BookNow } from "@/server/ApplicationService";
import { getById } from "@/server/ServerServices";
import ApiError from "@/utils/ErrorHandelars/ApiError";
import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { getBookSlotPayload } from "@/utils/payloads";
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

  const info = getBookSlotPayload(
    data._token,
    data?.slotDate as string,
    data?.slotTime as number,
    data?.hashParam as string
  );

  const payload = {
    _id: data._id,
    action: "/paynow",
    method: "POST",
    cookies: data?.state,
    info,
  };

  console.log("payload", payload);

  // const response = await BookNow(payload as IPayload);
  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "Slot Booked!",
    data: { message: "Booked" },
  });
});
