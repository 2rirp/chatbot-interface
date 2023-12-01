/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import IUser from "../interfaces/iuser";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  /* const [isLoading, setIsLoading] = useState(true); */

  /* const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
 */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data);
      }
      /*  setIsLoading(false);
      console.log(user); */
    };

    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseObj = await response.json();
      if (response.ok) {
        setUser(responseObj.data);
        return true;
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      if(error.message === "Incorrect e-mail and/or password") {
        alert("Credenciais incorretas.");
      }
      else {
        alert(`Erro não identificado: ${error}`)
      }
      return false;
    }
  };

  const update = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/users/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if(response.ok) { 
        return true;
      } else {
        throw data.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      if(error.message === "A nova senha não deve ser igual a senha previamente cadastrada!") {
        alert(`${error.message}`);
      }
      return false;
    }
  }
  const register = async (
    name: string,
    email: string,
    password: string,
    is_admin: boolean
  ) => {
    try {
      const response = await fetch("/api/users/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          is_admin,
        }),
      });

      const responseObj = await response.json();
      if (response.ok) {
        /* setDialogMessage("Usuário cadastrado com sucesso!");
        setOpenDialog(true); */
        alert("Usuário cadastrado com sucesso");
        return true;
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
      if(error.message === 'Email já está em uso!') {
        alert(error.message);
      } else {
        alert(`Erro não identificado: ${error}`);
      }
      return false;
    }
  };

  /* const handleCloseDialog = () => {
    setOpenDialog(false);
  }; */

  return (
    <UserContext.Provider value={{ user, setUser, login, register, update }}>
      {children}
      {/* <AlertDialog
        open={openDialog}
        onClose={handleCloseDialog}
        contentText={dialogMessage}
        buttonText="Fechar"
      /> */}
    </UserContext.Provider>
  );
};
