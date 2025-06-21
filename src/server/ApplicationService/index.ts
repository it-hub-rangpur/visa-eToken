"use server";

import { IPayload } from "@/interfaces";
import GetSessionInfo from "@/utils/server/GetSessionInfo";
import { abortRequests, raceRequests } from "@/utils/server/RequestManager";

export const CreateSession = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const htmlText = await response.text();

  const cookies = response?.headers?.getSetCookie();
  const sessionInfo = GetSessionInfo(htmlText);
  const info = {
    ...sessionInfo,
    cookies,
    action: payload?.action,
  };

  return info;
};

export const AbortCall = async (data: { _id: string }) => {
  abortRequests(data?._id);
  return {
    message: "Abort Successfully!",
  };
};

export const DoLogin = async (payload: IPayload) => {
  const response = (await raceRequests(payload)) as Response;
  const htmlText = await response.text();

  const cookies = response?.headers?.getSetCookie();
  const redirectPath = response?.headers?.get("Location");

  const sessionInfo = GetSessionInfo(htmlText);
  const info = {
    ...sessionInfo,
    action: "application-info",
    cookies,
    path:
      redirectPath === "https://payment.ivacbd.com/iv-admin" ? "/" : "/login",
  };

  return info;
};
