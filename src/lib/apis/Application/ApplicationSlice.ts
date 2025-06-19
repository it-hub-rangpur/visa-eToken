export interface IPaymentStatus {
  order_id: string;
  token_no: string;
  status: string;
  url: string;
}

export interface ISelectedPayment {
  name: string;
  slug: string;
  link: string;
}

export interface IInfo {
  name: string;
  web_id: string;
  _id: string;
}

export interface IServerInfo {
  lastLogin: string;
}

export interface IApplication {
  _id: string;
  center: number;
  ivac: number;
  visaType: number;
  phone: string;
  email: string;
  password: string;
  info: IInfo[];
  visit_purpose: string;
  hash_params: string;
  selected_payment: ISelectedPayment;
  createdAt: string;
  slot_dates: string[];
  paymentStatus: IPaymentStatus;
  status: boolean;
  serverInfo: IServerInfo;
}
