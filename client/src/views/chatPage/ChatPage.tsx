import "./chatPage.css";
import Chat from "../../components/chat/Chat";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";

interface ChatDataItem {
  message_id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  message_from_bot: boolean | null;
  user_id: string;
  menu: string;
  status: string;
  error_counter: number;
  numero_protocolo: string | null;
  save_cadastro: boolean | null;
}

export default function ChatPage() {
  const [chatData, setChatData] = useState<Array<ChatDataItem>>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  async function fetchChatData(userId: string, date: string) {
    try {
      const response = await fetch(`/api/${userId}/messages/${date}`, {
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
        <Sidebar fetchChatData={fetchChatData} onIconClick={openModal} />
        <Chat chatData={chatData} />
      </div>
    </div>
  );
}