export default interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  is_attendant?: boolean;
  is_lecturer?: boolean;
}

export interface IUserResponse {
  id?: number;
  name: string;
  email: string;
  updated_at: Date | null;
}
