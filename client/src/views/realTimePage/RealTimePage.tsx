import "./chatPage.css";
import { useContext, useEffect, useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";
import RealTimeSidebar from "../../components/realTimeSidebar/RealTimeSidebar";
import RealTimeChat from "../../components/realTimeChat/RealTimeChat";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";

interface botUser {
  botUserId: string;
  conversationId: number;
}

interface ChatDataItem {
  id?: number;
  content: string;
  conversation_id: number;
  created_at?: string;
  message_from_bot: boolean;
}

export default function RealTimePage() {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [botUsersNeedingAttendants, setBotUsersNeedingAttendants] = useState<
    Array<botUser>
  >([]);
  const [chatData, setChatData] = useState<Array<ChatDataItem>>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  async function fetchRedirectedConversations() {
    try {
      const response = await fetch(`/api/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          setBotUsersNeedingAttendants(responseObj.data);
        } else {
          console.error("No users data found:", responseObj.data);
        }
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
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

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchRedirectedConversations();
      } catch (error) {
        console.error("Error fetching redirected conversations:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("botUserNeedsAttendant", (newBotUser: botUser) => {
      setBotUsersNeedingAttendants((prevBotUsers) => [
        ...prevBotUsers,
        newBotUser,
      ]);
    });

    socketContext.socket.on("newMessage", (newMessageData: ChatDataItem) => {
      setChatData((prevChatData) => [...prevChatData, newMessageData]);
    });

    return () => {
      socketContext?.socket?.off("botUserNeedsAttendant");
      socketContext?.socket?.off("newMessage");
    };
  }, [socketContext]);

  function closeModal() {
    setmodalIsOpen(false);
  }
  function openModal() {
    setmodalIsOpen(true);
  }

  const handleSendMessage = (message: string) => {
    if (message.trim() !== "") {
      socketContext?.socket?.emit(
        "sendMessage",
        message,
        userContext?.user?.id
      );
    }
  };

  return (
    <div className="chatPage">
      {modalIsOpen && <SignUpModal onClose={closeModal} />}
      <div className="chatPage-container">
        <RealTimeSidebar
          botUsersNeedingAttendants={botUsersNeedingAttendants}
          fetchChatData={fetchChatData}
          onIconClick={openModal}
        />
        <RealTimeChat chatData={chatData} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
