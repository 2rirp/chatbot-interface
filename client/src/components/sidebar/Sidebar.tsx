import { useState, useEffect, useContext } from "react";
import DateInput from "../dateInput/DateInput";
import ChatList from "../chatList/Chatlist";
import "./sidebar.css";
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
  isActive: boolean;
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
          isActive={props.isActive}
          handleRegister={props.onRegisterClick}
          handleChatpage={props.onChatpageClick}
          handleLogout={props.onLogoutClick}
        />
      </div>
      <div className="sidebar-container">
        {chatListData.length > 0 ? (
          <ChatList users={chatListData} onUserClick={handleUserClick} />
        ) : (
          <p className="no-users-message">Não há usuários em atendimento.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
