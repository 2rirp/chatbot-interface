import { useContext } from "react";
/* import LoginPage from "../../views/loginPage/LoginPage";
 */ import { UserContext } from "../../contexts/UserContext";
import { SocketProvider } from "../../contexts/SocketProvider";
import RealTimePage from "../../views/realTimePage/RealTimePage";

interface Props {
  children: React.ReactNode;
}

export function RequireAdminAuth(props: Props) {
  const userContext = useContext(UserContext);

  if (userContext?.user?.is_admin !== null) {
    return <SocketProvider>{props.children}</SocketProvider>;
  }

  return <RealTimePage />;
}
