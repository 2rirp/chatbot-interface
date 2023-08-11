export default interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
}
