export interface IUser {
  email: string;
  password: string;
}

export interface IResponse<T> {
  status: number;
  data?: T;
  errors?: any;
}
