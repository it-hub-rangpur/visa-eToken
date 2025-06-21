export interface IProcessRequest {
  _id: string;
  _token: string;
  action: string;
  state: string[];
}

export interface IProcessResponse {
  _id?: string;
  _token: string;
  action: string;
  isLoggedin: boolean;
  path?: string;
  cookies: string[];
}

export interface IPayload {
  _id: string;
  cookies: string[];
  action?: string;
  method?: string;
  info?: unknown;
}
