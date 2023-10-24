import "./chatPage.css";
import { useContext, useEffect, useRef, useState } from "react";
import SignUpModal from "../../components/signUpModal/SignUpModal";
import Sidebar from "../../components/sidebar/Sidebar";
import Chat from "../../components/chat/Chat";
import { SocketContext } from "../../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import IMessage from "../../interfaces/imessage";
import IBotUser from "../../interfaces/ibotUser";
import PagesType from "../../interfaces/pagesName";
//import AlertDialog from "../../components/chat/alertDialog/alertDialog";

interface FetchBotUser {
  user_id: string;
  id: number;
}

interface TextAreaData {
  userId: string;
  message: string;
}

export default function RealTimePage() {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [botUsersNeedingAttendants, setBotUsersNeedingAttendants] = useState<
    Array<IBotUser>
  >([]);
  const [chatData, setChatData] = useState<Array<IMessage>>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<number>(NaN);
  const [currentBotUserId, setCurrentBotUserId] = useState<string>("");
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [hasFetchedChatData, setHasFetchedChatData] = useState(false);
  const [unreadConversations, setUnreadConversations] = useState<Array<number>>(
    []
  );
  const [newBotUserMessageCount, setNewBotUserMessageCount] = useState<
    number | undefined
  >(undefined);
  const [mustExitConversation, setMustExitConversation] =
    useState<boolean>(false);
  const [textAreaData, setTextAreaData] = useState<TextAreaData[]>([]);

  const currentPage: keyof PagesType = "real_time_page";
  const currentConversationIdRef = useRef(currentConversationId);
  const currentBotUserIdRef = useRef(currentBotUserId);
  const chatDataRef = useRef(chatData);
  // const [deleteUser, setDeleteUser] = useState(false);

  const navigate = useNavigate();

  const changeRoute = () => {
    navigate("/chatpage");
  };
  const user = {
    username: userContext?.user?.name || "",
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
          setNewBotUserMessageCount(undefined);
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
    currentConversationIdRef.current = currentConversationId;
    currentBotUserIdRef.current = currentBotUserId;
  }, [currentConversationId, currentBotUserId]);

  useEffect(() => {
    chatDataRef.current = chatData;
  }, [chatData]);

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

      setNewBotUserMessageCount((prevCount) => {
        if (prevCount === undefined) {
          return 1;
        } else {
          return prevCount + 1;
        }
      });
    });

    socketContext.socket.on(
      "newAttendantMessage",
      (newMessageData: IMessage) => {
        setChatData((prevChatData) => [...prevChatData, newMessageData]);
      }
    );

    socketContext.socket.on(
      "loadUnreadConversations",
      (unfollowedConversations: Array<number>) => {
        setUnreadConversations(unfollowedConversations);
      }
    );

    socketContext.socket.on(
      "newUnreadConversation",
      (conversationId: number) => {
        setUnreadConversations((prev) => [...prev, conversationId]);
      }
    );

    socketContext.socket.on(
      "removeFromUnreadConversations",
      (conversationId: number) => {
        setUnreadConversations((prev) =>
          prev.filter((id) => id !== conversationId)
        );
      }
    );

    socketContext.socket.on(
      "removeFromAttendance",
      (conversationId: number) => {
        if (currentConversationIdRef.current === conversationId) {
          exitConversation();
        }

        setBotUsersNeedingAttendants((prev) =>
          prev.filter((user) => user.conversationId !== conversationId)
        );
      }
    );

    socketContext.socket.on(
      "newMessageStatus",
      (messageData: Partial<IMessage>) => {
        const updatedMessages = chatDataRef.current.map((message) => {
          if (message.sid === messageData.sid) {
            return { ...message, status: messageData.status };
          }
          return message;
        });

        console.log(messageData);
        console.log(updatedMessages);
        setChatData(updatedMessages);
      }
    );
    return () => {
      socketContext?.socket?.off("botUserNeedsAttendant");
      socketContext?.socket?.off("newBotUserMessage");
      socketContext?.socket?.off("newAttendantMessage");
      socketContext?.socket?.off("loadUnreadConversations");
      socketContext?.socket?.off("newUnreadConversation");
      socketContext?.socket?.off("removeFromUnreadConversations");
      socketContext?.socket?.off("removeFromAttendance");
      socketContext?.socket?.off("newMessageStatus");
    };
  }, [socketContext]);

  function closeModal() {
    setmodalIsOpen(false);
    setActiveDropdown(false);
  }

  function openModal() {
    setmodalIsOpen(true);
    setActiveDropdown(true);
  }

  const handleSendMessage = async (messageContent: string) => {
    if (messageContent.trim() !== "") {
      socketContext?.socket?.emit(
        "sendMessage",
        messageContent,
        currentBotUserId,
        currentConversationId
      );
    }
  };

  const handleUnsetCount = () => {
    setNewBotUserMessageCount(undefined);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPressed);

    return () => {
      window.removeEventListener("keydown", handleKeyPressed);
    };
  }, []);

  const handleKeyPressed = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setMustExitConversation(true);
    }
  };

  const handleMarkAsUnread = (conversationId: number | null) => {
    if (conversationId === null) {
      return;
    }

    socketContext?.socket?.emit(
      "markAsUnread",
      conversationId,
      userContext?.user?.id
    );
    setUnreadConversations((prev) => [...prev, conversationId]);
  };

  const handleMarkAsRead = (conversationId: number) => {
    socketContext?.socket?.emit(
      "markAsRead",
      conversationId,
      userContext?.user?.id
    );

    setUnreadConversations((prev) =>
      prev.filter((id) => id !== conversationId)
    );
  };

  const handleIsAnUnreadConversation = (conversationId: number | null) => {
    return conversationId !== null &&
      unreadConversations.includes(conversationId)
      ? true
      : false;
  };

  const handleTextAreaChange = (newMessage: string) => {
    const userIndex = textAreaData.findIndex(
      (data) => data.userId === currentBotUserId
    );

    if (userIndex !== -1) {
      const updatedData = [...textAreaData];

      updatedData[userIndex].message = newMessage;

      setTextAreaData(updatedData);
    } else {
      console.log(`User with ID ${currentBotUserId} not found.`);
    }
  };

  const handleInitialMessage = () => {
    const userIndex = textAreaData.findIndex(
      (data) => data.userId === currentBotUserId
    );

    let initialMessage = "";

    if (userIndex !== -1) {
      initialMessage = textAreaData[userIndex].message;
    } else {
      const newUserEntry = {
        userId: currentBotUserId,
        message: "",
      };

      setTextAreaData((prevData) => [...prevData, newUserEntry]);
    }

    return initialMessage;
  };

  useEffect(() => {
    if (mustExitConversation) {
      exitConversation();
      setMustExitConversation(false);
    }
  }, [mustExitConversation]);

  async function deactivateCurrentConversation() {
    try {
      const deactivatedConversation = await fetch(`/api/conversations/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: currentConversationId,
          user: currentBotUserId,
        }),
      });
      if (deactivatedConversation.ok) {
        setBotUsersNeedingAttendants((prev) =>
          prev.filter((user) => user.conversationId !== currentConversationId)
        );

        exitConversation();
      } else {
        alert("Erro ao encerrar a conversa.");
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  }

  const exitConversation = () => {
    socketContext?.socket?.emit(
      "exitConversation",
      currentBotUserIdRef.current,
      currentConversationIdRef.current,
      userContext?.user?.id
    );

    setHasFetchedChatData(false);
    setCurrentBotUserId("");
    setCurrentConversationId(NaN);
  };

  return (
    <div className="page">
      {modalIsOpen && <SignUpModal onClose={closeModal} />}
      <div className="page-container">
        <Sidebar
          currentPage={currentPage}
          isActive={activeDropdown}
          botUsersList={botUsersNeedingAttendants}
          fetchChatData={fetchChatData}
          onRegisterClick={openModal}
          onHistoryPageClick={changeRoute}
          onReportClick={() => navigate("/relatorio")}
          onLogoutClick={logout}
          unreadConversations={unreadConversations}
          onMarkAsUnread={handleMarkAsUnread}
          onMarkAsRead={handleMarkAsRead}
        />
        {hasFetchedChatData ? (
          <Chat
            currentPage={currentPage}
            chatData={chatData}
            onSendMessage={handleSendMessage}
            onEndConversation={deactivateCurrentConversation}
            userId={currentBotUserId}
            conversationId={currentConversationId}
            newBotUserMessageCount={newBotUserMessageCount}
            unsetNewBotUserMessageCount={handleUnsetCount}
            onCloseChat={exitConversation}
            isAnUnreadConversation={handleIsAnUnreadConversation}
            onMarkAsUnread={handleMarkAsUnread}
            onTextAreaChange={handleTextAreaChange}
            initialMessage={handleInitialMessage}
            attendantName={user.username}
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
