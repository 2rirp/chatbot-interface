export {};
import IUser from "../../interfaces/iuser";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
