import GetSessionInfo from "@/utils/server/GetSessionInfo";
import { abortRequests, raceRequests } from "@/utils/server/RequestManager";

export const CreateSession = async (data: { _id: string }) => {
  const url = "http://payment.ivacbd.com";
  const response = (await raceRequests(url, data?._id)) as Response;
  const htmlText = await response.text();
  const cookies = response?.headers?.getSetCookie();

  const sessionInfo = GetSessionInfo(htmlText);
  const info = {
    cookies,
    ...sessionInfo,
  };
  return info;
};

export const AbortCall = async (data: { _id: string }) => {
  abortRequests(data?._id);
  return {
    message: "Abort Successfully!",
  };
};
