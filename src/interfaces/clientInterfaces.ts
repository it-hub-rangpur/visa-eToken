export interface IClient {
  _id: string;
  companyName: string;
  currentBalance: number;
  propritor: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  applications: string[];
  tokenAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  companyId: IClient | string;
  updatedAt: Date;
}

export interface IInfo {
  name: string;
  web_id: string;
}

export interface IApplication {
  _id?: string;
  companyId: IClient | string;
  client: IClient | string;
  assignTo: IUser | string;
  center: number | string;
  ivac: number | string;
  visaType: number | string;
  phone: string;
  email: string;
  info: IInfo[];
  status: boolean;
  paymentStatus: {
    url: string;
    status: string;
    order_id: string;
    tran_id: string;
  };
  paymentMethod: string;
  paymentNumber: string;
  paymentAmount: 0;
  autoPayment: false;
  accountNumber: string;
  pinNumber: string;
  password: string;
  visit_purpose: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}
