import "./chatPage.css";
import Chat from "../../components/chat/Chat";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";
import { useNavigate } from "react-router-dom";

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
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [hasFetchedChatData, setHasFetchedChatData] = useState(false);
  const navigate = useNavigate();

  const changeRoute = () => {
    navigate("/");
  };

  async function logout() {
    try {
      navigate("/login");

      await fetch("/api/users/logout", { method: "DELETE" });
      return;
    } catch (error: any) {
      console.error(error);
    }
  }

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
          setHasFetchedChatData(true);
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
    setActiveDropdown(false);
  }
  function openModal() {
    setmodalIsOpen(true);
    setActiveDropdown(true);
  }

  return (
    <div className="chatPage">
      {modalIsOpen && <SignUpModal onClose={closeModal} />}
      <div className="chatPage-container">
        <Sidebar
          fetchChatData={fetchChatData}
          isActive={activeDropdown}
          onRegisterClick={openModal}
          onChatpageClick={changeRoute}
          onReportClick={()=>navigate('/relatorio')}
          onLogoutClick={logout}
        />
        {hasFetchedChatData ? (
          <Chat chatData={chatData} />
        ) : (
          <div className="centered-message-container">
            <p className="centered-message">Nenhum usuário selecionado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
