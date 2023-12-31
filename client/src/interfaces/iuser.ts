export default interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  is_attendant: boolean;
  is_lecturer: boolean;
  updated_at: string;
}


export interface IAttendant {
  id?: number;
  name: string;
  email: string;
  updated_at: Date | null;
}