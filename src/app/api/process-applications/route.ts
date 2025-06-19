import catchAsync from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import httpStatus from "http-status";
import { NextResponse } from "next/server";

import db from "@/db/index.json";

export const GET = catchAsync(async (): Promise<NextResponse> => {
  return sendResponse({
    statusCode: httpStatus.OK,
    success: true,
    message: "Application Get Successfully!",
    data: db,
  });
});
