import { CreateSession } from "@/server/ApplicationService";
import catchAsync from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

export const POST = catchAsync(async (req: Request): Promise<NextResponse> => {
  const requestBody = await req.json();
  const data: { _id: string } = requestBody;
  const response = await CreateSession(data);
  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "Session Created Successfully!",
    data: response,
  });
});
