import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { NextResponse } from "next/server";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const POST = catchAsync(async (req: Request): Promise<NextResponse> => {
  const requestBody = await req.json();
  const data = requestBody;

  const response = await fetch(`${serverUrl}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const loginInfo = await response.json();

  return sendResponse(loginInfo);
});
