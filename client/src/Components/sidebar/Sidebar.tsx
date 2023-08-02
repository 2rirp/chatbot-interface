import { useState, useEffect } from "react";
import DateInput from "../dateInput/DateInput";
import ChatList from "../chatList/Chatlist";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./sidebar.css";
import SignUpModal from "../signUpModal/SignUpModal";
import { HTTPRequest } from "../../utils/HTTPRequest";
import IconButton from "@mui/material/IconButton";

interface ConversationData {
  error: null | string;
  data: Array<{
    id: string;
    last_conversation_created_at: string;
  }>;
  status: number;
}


interface SidebarProps {
  fetchChatData: (userId: string, date: string) => Promise<void>;
  onIconClick: () => void;
}
function Sidebar(props: SidebarProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [chatListData, setChatListData] = useState<ConversationData["data"]>(
    []
  );
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  async function fetchChatListData(date: string) {
    try {
      const response = await HTTPRequest<ConversationData>(
        `http://localhost:5000/${date}`,
        "GET"
      );

      if (response.data && response.data.data) {
        setChatListData(response.data.data);
      } else {
        console.error("No chat list data found:", response.data);
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
    <div className="sidebar-container">
      <div className="sidebar-header">
        <span className="attendant-name">Nome do atendente</span>
        <IconButton edge="end" aria-label="menu"onClick={props.onIconClick}><MoreVertIcon />
                </IconButton>
        <DateInput handleDateChange={handleDateChange} />
      </div>
      <ChatList users={chatListData} onUserClick={handleUserClick} />
    </div>
  );
}

export default Sidebar;
