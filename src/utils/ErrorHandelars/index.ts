// import envConfig from "@/Configs/envConfig";
import { NextResponse } from "next/server";
import httpStatus from "http-status";
import ApiError from "./ApiError";
// import ApiError from "./ApiError";

const envConfig = {
  environment: "development",
};

export interface IGenericErrorMessage {
  path: string | number;
  message: string;
}

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
}

const errorHandler = (error: Error) => {
  //   envConfig.environment === "development" &&
  console.log(`🐱‍🏍 errorHandler ~~`, error);

  let statusCode = 5000;
  let message = "Something went wrong!";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === "ValidationError") {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error.name === "MongoServerError") {
    statusCode = httpStatus.CONFLICT;
    message = "duplicate key error collection";
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = error?.message;
    errorMessages = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }

  return NextResponse.json({
    success: false,
    statusCode,
    message,
    errorMessages: errorMessages || null,
    stack: envConfig.environment === "development" ? error?.stack : null,
  });
};

export default errorHandler;
