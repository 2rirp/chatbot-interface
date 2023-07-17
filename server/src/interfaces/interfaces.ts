export interface IUser {
  email: string;
  password: string;
  is_admin?: boolean;
}

export interface IResponse<T> {
  status: number;
  data?: T;
  errors?: any;
}
