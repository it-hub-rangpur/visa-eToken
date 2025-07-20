import { catchAsync } from "@/utils/helpers/catchAsync";
import sendResponse from "@/utils/helpers/sendResponse";
import { NextRequest, NextResponse } from "next/server";
import { getLoginUserInfo } from "../__helpers";

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

    const response = await getLoginUserInfo(accessToken);
    return sendResponse(response);
  }
);
