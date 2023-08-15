import "./chatPage.css";
import { useContext, useEffect, useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";
import RealTimeSidebar from "../../components/realTimeSidebar/RealTimeSidebar";
import RealTimeChat from "../../components/realTimeChat/RealTimeChat";
import { SocketContext } from "../../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
/* import { UserContext } from "../../contexts/UserContext";*/
import IMessage from "../../interfaces/imessage";
import IBotUser from "../../interfaces/ibotUser";

interface FetchBotUser {
  user_id: string;
  id: number;
}

export default function RealTimePage() {
  const socketContext = useContext(SocketContext);
  /* const userContext = useContext(UserContext); */
  const [botUsersNeedingAttendants, setBotUsersNeedingAttendants] = useState<
    Array<IBotUser>
  >([]);
  const [chatData, setChatData] = useState<Array<IMessage>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number>();
  const [currentBotUserId, setCurrentBotUserId] = useState<string>("");
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const navigate = useNavigate();

  const changeRoute = () => {
    navigate("/chatpage");
  };

  async function fetchRedirectedConversations() {
    try {
      const response = await fetch(`/api/conversations/redirected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          const convertedData = responseObj.data.map((item: FetchBotUser) => ({
            botUserId: item.user_id,
            conversationId: item.id,
          }));
          setBotUsersNeedingAttendants(convertedData);
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

  async function fetchChatData(conversationId: number, botUserId: string) {
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
          setCurrentConversationId(conversationId);
          setCurrentBotUserId(botUserId);
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
      navigate("/login");

      await fetch("/api/users/logout", { method: "DELETE" });
      return;
    } catch (error: any) {
      console.error(error);
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

    socketContext.socket.on("botUserNeedsAttendant", (newBotUser: IBotUser) => {
      setBotUsersNeedingAttendants((prevBotUsers) => [
        ...prevBotUsers,
        newBotUser,
      ]);
    });

    socketContext.socket.on("newBotUserMessage", (newMessageData: IMessage) => {
      setChatData((prevChatData) => [...prevChatData, newMessageData]);
    });

    socketContext.socket.on(
      "newAttendantMessage",
      (newMessageData: IMessage) => {
        setChatData((prevChatData) => [...prevChatData, newMessageData]);
      }
    );
    return () => {
      socketContext?.socket?.off("botUserNeedsAttendant");
      socketContext?.socket?.off("newBotUserMessage");
      socketContext?.socket?.off("newAttendantMessage");
    };
  }, [socketContext]);

  function closeModal() {
    setmodalIsOpen(false);
    setActiveDropdown(false);
  }

  function openModal() {
    setmodalIsOpen(true);
    setActiveDropdown(true)
  }

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim() !== "") {
      try {
        const response = await fetch(
          `/api/messages/${currentConversationId}/${currentBotUserId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              textContent: messageContent,
            }),
          }
        );

        const responseObj = await response.json();
        if (response.ok) {
          const newMessage = responseObj.data;
          setChatData((prev) => [...prev, newMessage]);
        } else {
          throw responseObj.error;
        }
      } catch (error: any) {
        console.error(error.name, error.message);
        alert("Failed to send message: " + error.message);
      }
    }
  };

  async function deactivateCurrentConversation() {
    try {
      const deactivatedConversation = await fetch(`/api/conversations/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          conversation: currentConversationId,
          user: currentBotUserId
        })
      }) 
       return; 
    } catch (error: any) {
      console.error(error.name, error.message)
    }
  }

  return (
    <div className="chatPage">
      {modalIsOpen && <SignUpModal onClose={closeModal} />}
      <div className="chatPage-container">
        <RealTimeSidebar
          isActive={activeDropdown}
          botUsersNeedingAttendants={botUsersNeedingAttendants}
          fetchChatData={fetchChatData}
          onRegisterClick={openModal}
          onGoBackClick={changeRoute}
          onLogoutClick={logout}
        />

        <RealTimeChat chatData={chatData} onSendMessage={handleSendMessage} onEndConversation={deactivateCurrentConversation} userId={currentBotUserId}/>
      </div>
    </div>
  );
}
