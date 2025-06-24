export interface IProcessRequest {
  _id: string;
  _token: string;
  action: string;
  state: string[];
  resend?: number;
  otp?: string;
  slotDate?: string;
  slotTime?: number;
  hashParam?: string;
}

export interface IProcessResponse {
  _id?: string;
  _token: string;
  action: string;
  isLoggedin: boolean;
  path?: string;
  cookies: string[];
  resend?: number;
  success?: boolean;
  slot_dates?: string[];
  slot_times?: { hour: number }[];
}

export interface IPayload {
  _id: string;
  cookies: string[];
  action?: string;
  method?: string;
  resend?: number;
  info?: { [key: string]: string | number };
  otp?: string;
  success?: boolean;
}
