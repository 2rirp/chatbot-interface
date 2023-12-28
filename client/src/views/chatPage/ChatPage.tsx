import "./chatPage.css";
import { useState, useEffect, useContext, useRef } from "react";

import SignUpModal from "../../components/signUpModal/SignUpModal";
import { useNavigate } from "react-router-dom";
import IBotUser from "../../interfaces/ibotUser";
import Sidebar from "../../components/sidebar/Sidebar";
import Chat from "../../components/chat/Chat";
import IMessage from "../../interfaces/imessage";
import { SocketContext } from "../../contexts/SocketContext";
import PagesType from "../../interfaces/pagesName";

interface FetchUserHistoryPage {
  user_id: string;
  served_by: number | null;
  last_conversation_created_at: string;
}

export default function ChatPage() {
  const [chatData, setChatData] = useState<Array<IMessage>>([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [hasFetchedChatData, setHasFetchedChatData] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [userList, setUserList] = useState<Array<IBotUser>>([]);
  const [currentBotUserId, setCurrentBotUserId] = useState<string>("");
  const [isItToday, setIsItToday] = useState<boolean>(false);
  const socketContext = useContext(SocketContext);
  const currentPage: keyof PagesType = "history_page";
  const currentBotUserIdRef = useRef(currentBotUserId);
  const [conversationStatus, setConversationStatus] = useState<string | null>(
    null
  );
  const [attendantsIdAndNames, setAttendantsIdAndNames] = useState<
    Record<number, string | null>
  >({});
  const [shouldFetchNames, setShouldFetchNames] = useState<boolean>(false);

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

      if (response.ok) {
        if (responseObj.data) {
          let convertedData: IBotUser[] = responseObj.data.map(
            (item: FetchUserHistoryPage) => ({
              botUserId: item.user_id,
              lastConversationCreatedAt: item.last_conversation_created_at,
              servedBy: item.served_by,
            })
          );

          convertedData.forEach((item) => {
            setAttendantsIdAndNames((prev) => {
              if (item.servedBy) {
                if (prev[item.servedBy] === undefined) {
                  return { ...prev, [item.servedBy]: null };
                }
              }
              return prev;
            });
          });
          setUserList(convertedData);
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
          checkIfItsToday();
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

  async function fetchAttendantsNames(attendantsId: number[]) {
    try {
      const response = await fetch(`/api/users/get-names`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendantsId: attendantsId,
        }),
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          responseObj.data.forEach(
            ({ id, name }: { id: number; name: string }) => {
              if (attendantsIdAndNames.hasOwnProperty(id)) {
                setAttendantsIdAndNames((prev) => ({
                  ...prev,
                  [id]: name,
                }));
              }
            }
          );
        } else {
          console.warn("No attendants name retrieved:", responseObj.data);
        }
        setShouldFetchNames((prev) => !prev);
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

  const checkIfItsToday = () => {
    const options = { timeZone: "America/Sao_Paulo" };
    const [day, month, year] = new Date()
      .toLocaleString("pt-BR", options)
      .split(",")[0]
      .split("/");

    const date = `${year}-${month}-${day}`;
    console.log(`${selectedDate} e ${date}`);

    if (selectedDate === date) {
      setIsItToday(true);
    } else {
      setIsItToday(false);
    }
  };

  const handleRedirectChat = (
    conversationId: number | null,
    userId: string | null
  ) => {
    if (conversationId === null || userId === null) {
      return;
    }

    socketContext?.socket?.emit(
      "redirectToAttendantFromInterface",
      conversationId,
      userId
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const promises = [];

        if (selectedDate !== "") {
          promises.push(fetchUserListByDate(selectedDate));

          await Promise.all(promises);

          setShouldFetchNames((prev) => !prev);
        }
      } catch (error) {
        console.error("Error fetching conversations by date:", error);
      }
    }

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    if (shouldFetchNames) {
      const attendantsId = Object.keys(attendantsIdAndNames).map(Number);

      if (attendantsId.length > 0) {
        fetchAttendantsNames(attendantsId);
      }
    }
  }, [shouldFetchNames]);

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

  useEffect(() => {
    currentBotUserIdRef.current = currentBotUserId;
  }, [currentBotUserId]);

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("botUserNeedsAttendant", (newBotUser: IBotUser) => {
      if (currentBotUserIdRef.current === newBotUser.botUserId) {
        setConversationStatus("talking_to_attendant");
      }
    });

    return () => {
      socketContext?.socket?.off("botUserNeedsAttendant");
    };
  }, [socketContext]);

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
          attendantsIdAndNames={attendantsIdAndNames}
        />

        {hasFetchedChatData ? (
          <Chat
            currentPage={currentPage}
            chatData={chatData}
            userId={currentBotUserId}
            onCloseChat={closeChat}
            isItToday={isItToday}
            onRedirectChat={handleRedirectChat}
            newConversationStatus={conversationStatus}
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
