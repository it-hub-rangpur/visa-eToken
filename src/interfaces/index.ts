export interface IProcessRequest {
  _id: string;
  _token: string;
  action: string;
  state: string[];
  resend?: number;
  otp?: string;
  date?: string;
  time?: number;
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
}

export interface IPayload {
  _id: string;
  cookies: string[];
  action?: string;
  method?: string;
  info?: { [key: string]: string | number };
}
