import "./sidebar.css";
import { useContext, useEffect, useState } from "react";
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
  onHistoryClick: () => void;
  onLogoutClick: () => Promise<void>;
}

function RealTimeSidebar(props: RealTimeSidebarProps) {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [botUsersNeedingAttendants, setBotUsersNeedingAttendants] = useState<
    Array<botUser>
  >([]);

  const user = {
    username: userContext?.user?.name || "",
  };

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("botUserNeedsAttendant", (newBotUser: botUser) => {
      setBotUsersNeedingAttendants((prevBotUsers) => [
        ...prevBotUsers,
        newBotUser,
      ]);
    });

    return () => {
      socketContext?.socket?.off("botUserNeedsAttendant");
    };
  }, [socketContext]);

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
        {/* <IconButton edge="end" aria-label="menu" onClick={props.onIconClick}>
          <MoreVertIcon className="menu-icon" />
        </IconButton> */}<DropdownMenu handleRegister={props.onRegisterClick} handleHistory={props.onHistoryClick} handleLogout={props.onLogoutClick}/>
      </div>
      <div className="sidebar-container">
        <ul>
          {botUsersNeedingAttendants.map((botUser) => (
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
