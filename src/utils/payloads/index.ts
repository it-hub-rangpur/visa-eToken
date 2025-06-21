import { IApplication } from "@/lib/apis/Application/ApplicationSlice";

export const createSessionPayload = (id: string) => {
  return {
    _id: id,
  };
};

export const getWithoutOtpPayload = (token: string, item: IApplication) => {
  return {
    _token: token,
    user_id: item?.email,
    password: item?.password,
    remember: "on",
  };
};
