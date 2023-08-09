import "./chatPage.css";
import { useContext, useEffect, useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";
import RealTimeSidebar from "../../components/realTimeSidebar/RealTimeSidebar";
import RealTimeChat from "../../components/realTimeChat/RealTimeChat";
import { SocketContext } from "../../contexts/SocketContext";

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
          onIconClick={openModal}
        />
        <RealTimeChat chatData={chatData} />
      </div>
    </div>
  );
}
