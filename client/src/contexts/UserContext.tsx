import React from "react";
import IUser from "../interfaces/iuser";

interface UserContextProps {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    is_admin: boolean,
    is_attendant: boolean,
    is_lecturer: boolean,
  ) => Promise<boolean>;
  update: (email: string, password: string) => Promise<boolean>;
}

export const UserContext = React.createContext<UserContextProps | null>(null);
