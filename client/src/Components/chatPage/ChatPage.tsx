import "./chatPage.css";
import Chat from "../chat/Chat";
import Sidebar from "../sidebar/Sidebar";
import { useState } from "react";
import { HTTPRequest } from "../../utils/HTTPRequest";
import SignUpModal from "../signUpModal/SignUpModal";

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

interface ChatData {
  error: null | string;
  data: ChatDataItem[];
  status: number;
}

export default function ChatPage() {
  const [chatData, setChatData] = useState<ChatData["data"]>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  async function fetchChatData(userId: string, date: string) {
    try {
      const response = await HTTPRequest<ChatData>(
        `http://localhost:5000/${userId}/messages/${date}`,
        "GET"
      );

      if (response.data) {
        setChatData(response.data.data);
      } else {
        console.error("No chat data found:", response.data);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
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
        <Sidebar fetchChatData={fetchChatData} onIconClick={openModal}/>
        <Chat chatData={chatData} />
      </div>
    </div>
  );
}
