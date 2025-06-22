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

export const applicationInfoPayload = (token: string, item: IApplication) => {
  return {
    _token: token,
    highcom: item?.center,
    ivac_id: item?.ivac,
    visa_type: item?.visaType,
    webfile_id: item?.info[0]?.web_id,
    webfile_id_repeat: item?.info[0]?.web_id,
    family_count: item?.info?.length - 1,
    visit_purpose: item?.visit_purpose,
  };
};

export const personalInfoPayload = (token: string, item: IApplication) => {
  const family1 = item?.info[0];
  const formattedData: { [key: string]: string } = {};

  if (item?.info?.length) {
    item?.info?.forEach((member, index) => {
      if (index > 0) {
        formattedData[`family[${index}][name]`] = member.name;
        formattedData[`family[${index}][webfile_no]`] = member.web_id;
        formattedData[`family[${index}][again_webfile_no]`] = member.web_id;
      }
    });
  }

  return {
    _token: token,
    full__name: family1?.name,
    email_name: item?.email,
    pho_ne: item?.phone,
    ...formattedData,
  };
};

export const overviewInfoPayload = (token: string) => {
  return {
    _token: token,
  };
};

export const paymentOtpPayload = (token: string, resend: number) => {
  return {
    _token: token,
    resend: resend,
  };
};

export const verifyOtpPayload = (token: string, otp: string) => {
  return {
    _token: token,
    otp: otp,
  };
};

export const getTimeSlotPayload = (token: string, date: string) => {
  return {
    _token: token,
    appointment_date: date,
  };
};

export const getBookSlotPayload = (
  token: string,
  date: string,
  time: number,
  hash_param: string
) => {
  return {
    _token: token,
    appointment_date: date,
    appointment_time: time ?? 9,
    hash_param: hash_param,
    "selected_payment[name]": "VISA",
    "selected_payment[slug]": "visacard",
    "selected_payment[link]":
      "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/visa.png",
  };
};
