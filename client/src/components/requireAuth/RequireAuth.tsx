import { useContext } from "react";
import LoginPage from "../../views/loginPage/LoginPage";
import { UserContext } from "../../contexts/UserContext";
import { SocketProvider } from "../../contexts/SocketProvider";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth(props: Props) {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (userContext?.user !== null) {
    if (props.requireAdmin && userContext?.user.is_admin) {
      return <SocketProvider>{props.children}</SocketProvider>;
    }

    if (!props.requireAdmin) {
      return <SocketProvider>{props.children}</SocketProvider>;
    }

    if (userContext?.user.is_admin === false && props.requireAdmin) {
      alert("Sem permissão para acessar essa página.");
      navigate("/");
      return;
    }
  } else {
    return <LoginPage />;
  }
}
