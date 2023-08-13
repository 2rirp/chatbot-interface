import { useState, useEffect, useContext } from "react";
import DateInput from "../dateInput/DateInput";
import ChatList from "../chatList/Chatlist";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./sidebar.css";
import IconButton from "@mui/material/IconButton";
import { UserContext } from "../../contexts/UserContext";
import DropdownMenuHistory from "../chat/dropdownMenuHistory/dropdownMenuHistory";

interface ConversationData {
  data: Array<{
    id: string;
    last_conversation_created_at: string;
  }>;
}

interface SidebarProps {
  fetchChatData: (userId: string, date: string) => Promise<void>;
  onRegisterClick: () => void;
  onChatpageClick: () => void;
  onLogoutClick: () => void;
}

function Sidebar(props: SidebarProps) {
  const userContext = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [chatListData, setChatListData] = useState<ConversationData["data"]>(
    []
  );

  const user = {
    username: userContext?.user?.name || "",
  };

  async function fetchChatListData(date: string) {
    try {
      const response = await fetch(`/api/${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          setChatListData(responseObj.data);
        } else {
          console.error("No chat list data found:", responseObj.data);
        }
      } else {
        throw responseObj.error;
      }
    } catch (error) {
      console.error("Error fetching chat list data:", error);
    }
  }

  function handleDateChange(date: string) {
    setSelectedDate(date);
  }

  async function handleUserClick(userId: string) {
    await props.fetchChatData(userId, selectedDate);
  }

  useEffect(() => {
    if (selectedDate !== "") {
      fetchChatListData(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p className="attendant-name">{user.username}</p>
        <DateInput handleDateChange={handleDateChange} />
        <DropdownMenuHistory
          handleRegister={props.onRegisterClick}
          handleChatpage={props.onChatpageClick}
          handleLogout={props.onLogoutClick}
        />
      </div>
      <div className="sidebar-container">
        <ChatList users={chatListData} onUserClick={handleUserClick} />
      </div>
    </div>
  );
}

export default Sidebar;
