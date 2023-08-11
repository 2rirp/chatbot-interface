import "./chatPage.css";
import { useContext, useEffect, useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";
import RealTimeSidebar from "../../components/realTimeSidebar/RealTimeSidebar";
import RealTimeChat from "../../components/realTimeChat/RealTimeChat";
import { SocketContext } from "../../contexts/SocketContext";
import { useNavigate } from "react-router-dom";

interface ChatDataItem {
  id?: number;
  content: string;
  conversation_id: number;
  created_at?: string;
  message_from_bot: boolean;
}

export default function RealTimePage() {
  const socketContext = useContext(SocketContext);
  const [chatData, setChatData] = useState<Array<ChatDataItem>>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const changeRoute = () => {
    navigate("/chatpage")
  }

  async function fetchChatData(conversationId: number) {
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          setChatData(responseObj.data);
        } else {
          console.error("No chat data found:", responseObj.data);
        }
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  }
  async function logout() {
    try {
      await fetch('/api/logout', { method: "POST" });
      return;
    } catch (error: any) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (socketContext?.socket) {
      socketContext.socket.on("newMessage", (newMessageData: ChatDataItem) => {
        setChatData((prevChatData) => [...prevChatData, newMessageData]);
      });

      return () => {
        socketContext?.socket?.off("newMessage");
      };
    }
  }, [socketContext]);
  
  
  function closeModal() {
    setmodalIsOpen(false);
  }
  function openModal() {
    setmodalIsOpen(true);
  }

  return (
    <div className="chatPage">
      {modalIsOpen && <SignUpModal onClose={closeModal} />}
      <div className="chatPage-container">
        <RealTimeSidebar
          fetchChatData={fetchChatData}
          onRegisterClick={openModal}
          onHistoryClick={changeRoute}
          onLogoutClick={logout}
        />
        <RealTimeChat chatData={chatData} />
      </div>
    </div>
  );
}
