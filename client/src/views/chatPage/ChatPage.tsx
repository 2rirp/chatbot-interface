import "./chatPage.css";
import { useState, useEffect } from "react";

import SignUpModal from "../../components/signUpModal/SignUpModal";
import { useNavigate } from "react-router-dom";
import IBotUser from "../../interfaces/ibotUser";
import Sidebar from "../../components/sidebar/Sidebar";
import Chat from "../../components/chat/Chat";
import IMessage from "../../interfaces/imessage";

export default function ChatPage() {
  const [chatData, setChatData] = useState<Array<IMessage>>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [hasFetchedChatData, setHasFetchedChatData] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [userList, setUserList] = useState<Array<IBotUser>>([]);
  const [currentBotUserId, setCurrentBotUserId] = useState<string>("");
  const currentPage = "history-page";
  const navigate = useNavigate();

  const changeRoute = () => {
    navigate("/");
  };

  function handleDateChange(date: string) {
    setSelectedDate(date);
  }

  async function logout() {
    try {
      navigate("/login");

      await fetch("/api/users/logout", { method: "DELETE" });
      return;
    } catch (error: any) {
      console.error(error);
    }
  }

  async function fetchUserListByDate(date: string) {
    try {
      const response = await fetch(`/api/${date}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();
      console.log(responseObj);

      if (response.ok) {
        if (responseObj.data) {
          setUserList(responseObj.data);
        } else {
          console.error("No user list data found:", responseObj.data);
        }
      } else {
        throw responseObj.error;
      }
    } catch (error) {
      console.error("Error fetching user list data:", error);
    }
  }

  async function fetchChatDataByDate(botUserId: string) {
    try {
      const response = await fetch(
        `/api/${botUserId}/messages/${selectedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          setCurrentBotUserId(botUserId);
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

  const closeChat = () => {
    setHasFetchedChatData(false);
    setCurrentBotUserId("");
  };

  function closeModal() {
    setmodalIsOpen(false);
    setActiveDropdown(false);
  }

  function openModal() {
    setmodalIsOpen(true);
    setActiveDropdown(true);
  }

  useEffect(() => {
    if (selectedDate !== "") {
      console.log(selectedDate);
      fetchUserListByDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPressed);

    return () => {
      window.removeEventListener("keydown", handleKeyPressed);
    };
  }, []);

  const handleKeyPressed = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeChat();
    }
  };

  return (
    <div className="page">
      {modalIsOpen && <SignUpModal onClose={closeModal} />}
      <div className="page-container">
        <Sidebar
          currentPage={currentPage}
          isActive={activeDropdown}
          onDataChange={handleDateChange}
          botUsersList={userList}
          fetchChatDataByDate={fetchChatDataByDate}
          onRegisterClick={openModal}
          onChatPageClick={changeRoute}
          onReportClick={() => navigate("/relatorio")}
          onLogoutClick={logout}
        />

        {hasFetchedChatData ? (
          <Chat
            currentPage={currentPage}
            chatData={chatData}
            userId={currentBotUserId}
          />
        ) : (
          <div className="centered-message-container">
            <p className="centered-message">Nenhum usuário selecionado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
