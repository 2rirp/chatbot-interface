export default interface IUser {
  id?: any;
  name: string;
  email: string;
  password: string;
  is_admin: boolean;
  is_attendant: boolean;
  is_lecturer: boolean;
  updated_at: string;
}
