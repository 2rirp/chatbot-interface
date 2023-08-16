import "./sidebar.css";
import { useContext } from "react";
import { SocketContext } from "../../contexts/SocketContext"; // Import your SocketContext
import { UserContext } from "../../contexts/UserContext";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import IconButton from "@mui/material/IconButton";
import DropdownMenu from "../dropdownMenu/dropdownMenu";
import IBotUser from "../../interfaces/ibotUser";

interface RealTimeSidebarProps {
  fetchChatData: (conversationId: number, botUserId: string) => Promise<void>;
  onRegisterClick: () => void;
  onGoBackClick: () => void;
  onLogoutClick: () => void;
  isActive: boolean;
  botUsersNeedingAttendants: Array<IBotUser>;
}

function RealTimeSidebar(props: RealTimeSidebarProps) {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);

  const user = {
    username: userContext?.user?.name || "",
  };

  async function handleUserClick(botUser: IBotUser) {
    socketContext?.socket?.emit(
      "enterConversation",
      botUser.botUserId,
      botUser.conversationId,
      userContext?.user?.id
    );
    await props.fetchChatData(botUser.conversationId, botUser.botUserId);
  }

  return (
    <div className="real-time-sidebar">
      <div className="real-time-sidebar-header">
        <p className="attendant-name">{user.username}</p>
        <DropdownMenu
        isActive={props.isActive}
          handleRegister={props.onRegisterClick}
          handleHistory={props.onGoBackClick}
          handleLogout={props.onLogoutClick}
        />
      </div>
      <div className="real-time-sidebar-container">
        <ul>
          {props.botUsersNeedingAttendants.map((botUser) => (
            <li
              key={botUser.botUserId}
              onClick={() => handleUserClick(botUser)}
            >
              <div>{botUser.botUserId}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RealTimeSidebar;
