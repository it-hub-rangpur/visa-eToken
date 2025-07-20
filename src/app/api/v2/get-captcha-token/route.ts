import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { NextResponse } from "next/server";

export const GET = catchAsync(async (): Promise<NextResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/recaptcha-token/anti`
  );

  const data = await response.json();
  return sendResponse(data);
});
