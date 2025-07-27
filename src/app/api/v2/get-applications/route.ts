import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { NextRequest, NextResponse } from "next/server";

export const GET = catchAsync(
  async (req: NextRequest): Promise<NextResponse> => {
    const accessToken = req.cookies.get("accessToken")?.value || "";

    if (!accessToken) {
      return sendResponse({
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: {
          message: "Unauthorized",
        },
      });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/applications`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return sendResponse(data);
  }
);
