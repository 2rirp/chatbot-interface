import "./sidebar.css";
import { useContext } from "react";
import { SocketContext } from "../../contexts/SocketContext"; // Import your SocketContext
import { UserContext } from "../../contexts/UserContext";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import IconButton from "@mui/material/IconButton";
import DropdownMenu from "../dropdownMenu/dropdownMenu";

interface botUser {
  botUserId: string;
  conversationId: number;
}

interface RealTimeSidebarProps {
  fetchChatData: (conversationId: number) => Promise<void>;
  onRegisterClick: () => void;
  onGoBackClick: () => void;
  onLogoutClick: () => void;
  botUsersNeedingAttendants: Array<botUser>;
}

function RealTimeSidebar(props: RealTimeSidebarProps) {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);

  const user = {
    username: userContext?.user?.name || "",
  };

  async function handleUserClick(botUser: botUser) {
    socketContext?.socket?.emit(
      "enterConversation",
      botUser.botUserId,
      botUser.conversationId,
      userContext?.user?.id
    );
    await props.fetchChatData(botUser.conversationId);
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p className="attendant-name">{user.username}</p>
        <DropdownMenu
          handleRegister={props.onRegisterClick}
          handleHistory={props.onGoBackClick}
          handleLogout={props.onLogoutClick}
        />
      </div>
      <div className="sidebar-container">
        <ul>
          {props.botUsersNeedingAttendants.map((botUser) => (
            <li key={botUser.botUserId}>
              <div>
                botUserId={botUser.botUserId}{" "}
                <button onClick={() => handleUserClick(botUser)}>
                  Click to chat
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RealTimeSidebar;
