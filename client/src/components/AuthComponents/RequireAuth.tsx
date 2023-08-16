import { useContext } from "react";
import LoginPage from "../../views/loginPage/LoginPage";
import { UserContext } from "../../contexts/UserContext";
import { SocketProvider } from "../../contexts/SocketProvider";

interface Props {
  children: React.ReactNode;
}

export function RequireAuth(props: Props) {
  const userContext = useContext(UserContext); //here i want the user provided by the context

  if (userContext?.user !== null) {
    return <SocketProvider>{props.children}</SocketProvider>;
  }

  return <LoginPage />;
}
