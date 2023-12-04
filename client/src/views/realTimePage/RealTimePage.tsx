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
  served_by: number | null;
  content: string;
  created_at: string;
  sid: string;
  status: string;
  media_type: string;
}

interface TextAreaData {
  userId: string;
  message: string;
}

export default function RealTimePage() {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [botUsersRedirectedToAttendant, setBotUsersRedirectedToAttendant] =
    useState<Array<IBotUser> | null>(null);
  const [botUsersRedirectedToLecturer, setBotUsersRedirectedToLecturer] =
    useState<Array<IBotUser> | null>(null);
  const [chatData, setChatData] = useState<Array<IMessage>>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<number>(NaN);
  const [currentBotUserId, setCurrentBotUserId] = useState<string>("");
  const [currentBotUserServedBy, setCurrentBotUserServedBy] = useState<
    number | null
  >(null);
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
  const [hasFetchedOlderMessages, setHasFetchedOlderMessages] = useState<
    boolean | null
  >(false);

  const currentPage: keyof PagesType = "real_time_page";
  const currentConversationIdRef = useRef(currentConversationId);
  const currentBotUserIdRef = useRef(currentBotUserId);
  const chatDataRef = useRef(chatData);
  const botUsersRedirectedToAttendantRef = useRef(
    botUsersRedirectedToAttendant
  );
  const botUsersRedirectedToLecturerRef = useRef(botUsersRedirectedToLecturer);
  // const [deleteUser, setDeleteUser] = useState(false);

  const navigate = useNavigate();

  const changeRoute = () => {
    navigate("/chatpage");
  };
  const user = {
    id: userContext?.user?.id || "",
    username: userContext?.user?.name || "",
    isAdmin: userContext?.user?.is_admin || "",
    isAttendant: userContext?.user?.is_attendant || "",
    isLecturer: userContext?.user?.is_lecturer || "",
  };

  async function fetchAttendantRedirectedConversations() {
    try {
      const response = await fetch(`/api/conversations/redirected/attendant`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          let convertedData: IBotUser[] = [];
          if (user.isAdmin) {
            convertedData = responseObj.data.map((item: FetchBotUser) => ({
              botUserId: item.user_id,
              conversationId: item.id,
              servedBy: item.served_by,
              lastMessageContent: item.content,
              lastMessageCreatedAt: item.created_at,
              lastMessageSid: item.sid,
              lastMessageStatus: item.status,
              lastMessageMediaType: item.media_type,
            }));
          } else if (user.isAttendant) {
            /* convertedData = responseObj.data
              .filter(
                (item: FetchBotUser) =>
                  item.served_by === user.id || item.served_by === null
              )
              .map((item: FetchBotUser) => ({
                botUserId: item.user_id,
                conversationId: item.id,
                servedBy: item.served_by,
                lastMessageContent: item.content,
                lastMessageCreatedAt: item.created_at,
                lastMessageSid: item.sid,
                lastMessageStatus: item.status,
                lastMessageMediaType: item.media_type,
              })); */
            convertedData = responseObj.data.map((item: FetchBotUser) => ({
              botUserId: item.user_id,
              conversationId: item.id,
              servedBy: item.served_by,
              lastMessageContent: item.content,
              lastMessageCreatedAt: item.created_at,
              lastMessageSid: item.sid,
              lastMessageStatus: item.status,
              lastMessageMediaType: item.media_type,
            }));
          }
          setBotUsersRedirectedToAttendant(convertedData);
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

  async function fetchLecturerRedirectedConversations() {
    try {
      const response = await fetch(`/api/conversations/redirected/lecturer`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data) {
          let convertedData: IBotUser[] = [];
          if (user.isAdmin) {
            convertedData = responseObj.data.map((item: FetchBotUser) => ({
              botUserId: item.user_id,
              conversationId: item.id,
              servedBy: item.served_by,
              lastMessageContent: item.content,
              lastMessageCreatedAt: item.created_at,
              lastMessageSid: item.sid,
              lastMessageStatus: item.status,
              lastMessageMediaType: item.media_type,
            }));
          } else if (user.isLecturer) {
            convertedData = responseObj.data
              .filter((item: FetchBotUser) => item.served_by === user.id)
              .map((item: FetchBotUser) => ({
                botUserId: item.user_id,
                conversationId: item.id,
                servedBy: item.served_by,
                lastMessageContent: item.content,
                lastMessageCreatedAt: item.created_at,
                lastMessageSid: item.sid,
                lastMessageStatus: item.status,
                lastMessageMediaType: item.media_type,
              }));
          }
          setBotUsersRedirectedToLecturer(convertedData);
        } else {
          console.error("No users data found for lecturer:", responseObj.data);
        }
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  }

  async function fetchChatData(
    conversationId: number,
    botUserId: string,
    servedBy: number | null
  ) {
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
          setCurrentBotUserServedBy(servedBy);
          setChatData(responseObj.data);
          setNewBotUserMessageCount(undefined);
          setHasFetchedChatData(true);
          setHasFetchedOlderMessages(false);
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

  async function fetchChatDataFromThreeDays(dateLimit: string) {
    try {
      const response = await fetch(
        `/api/messages/${currentBotUserId}/${dateLimit}`,
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
          console.log(
            Array.isArray(responseObj.data),
            responseObj.data.length === 0,
            responseObj.data[0]
          );
          if (
            Array.isArray(responseObj.data) &&
            responseObj.data.length === 0
          ) {
            setHasFetchedOlderMessages(null);
          } else {
            setChatData((chatData) => [...responseObj.data, ...chatData]);
            setHasFetchedOlderMessages(true);
          }
        } else {
          console.error(
            "No chat data found from three days:",
            responseObj.data
          );
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
        if (user.isAdmin || user.isAttendant) {
          await fetchAttendantRedirectedConversations();
        }

        if (user.isLecturer) {
          await fetchLecturerRedirectedConversations();
        }
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
    botUsersRedirectedToAttendantRef.current = botUsersRedirectedToAttendant;
  }, [botUsersRedirectedToAttendant]);

  useEffect(() => {
    botUsersRedirectedToLecturerRef.current = botUsersRedirectedToLecturer;
  }, [botUsersRedirectedToLecturer]);

  useEffect(() => {
    if (!socketContext?.socket) return;

    socketContext.socket.on("botUserNeedsAttendant", (newBotUser: IBotUser) => {
      setBotUsersRedirectedToAttendant((prevBotUsers) => {
        if (prevBotUsers === null) {
          return [newBotUser];
        } else {
          return [...prevBotUsers, newBotUser];
        }
      });
    });

    socketContext.socket.on("newBotUserMessage", (newMessageData: IMessage) => {
      if (currentConversationIdRef.current === newMessageData.conversation_id) {
        setChatData((prevChatData) => [...prevChatData, newMessageData]);
        setNewBotUserMessageCount((prevCount) => {
          if (prevCount === undefined) {
            return 1;
          } else {
            return prevCount + 1;
          }
        });
      }

      if (botUsersRedirectedToAttendantRef.current) {
        const updatedBotUserList = botUsersRedirectedToAttendantRef.current.map(
          (botUser) => {
            if (
              botUser.conversationId === newMessageData.conversation_id &&
              (newMessageData.status || newMessageData.status === null) &&
              newMessageData.content &&
              newMessageData.created_at &&
              (newMessageData.sid || newMessageData.sid === null) &&
              (newMessageData.media_type || newMessageData.media_type === null)
            ) {
              return {
                ...botUser,
                lastMessageStatus: newMessageData.status,
                lastMessageContent: newMessageData.content,
                lastMessageCreatedAt: newMessageData.created_at,
                lastMessageSid: newMessageData.sid,
                lastMessageMediaType: newMessageData.media_type,
              };
            }
            return botUser;
          }
        );

        const orderedBotUserList = updatedBotUserList.sort((a, b) =>
          a.lastMessageCreatedAt > b.lastMessageCreatedAt ? -1 : 1
        );

        setBotUsersRedirectedToAttendant(orderedBotUserList);
      } else if (botUsersRedirectedToLecturerRef.current) {
        const updatedBotUserList = botUsersRedirectedToLecturerRef.current.map(
          (botUser) => {
            if (
              botUser.conversationId === newMessageData.conversation_id &&
              (newMessageData.status || newMessageData.status === null) &&
              newMessageData.content &&
              newMessageData.created_at &&
              (newMessageData.sid || newMessageData.sid === null) &&
              (newMessageData.media_type || newMessageData.media_type === null)
            ) {
              return {
                ...botUser,
                lastMessageStatus: newMessageData.status,
                lastMessageContent: newMessageData.content,
                lastMessageCreatedAt: newMessageData.created_at,
                lastMessageSid: newMessageData.sid,
                lastMessageMediaType: newMessageData.media_type,
              };
            }
            return botUser;
          }
        );

        const orderedBotUserList = updatedBotUserList.sort((a, b) =>
          a.lastMessageCreatedAt > b.lastMessageCreatedAt ? -1 : 1
        );

        setBotUsersRedirectedToLecturer(orderedBotUserList);
      }
    });

    socketContext.socket.on(
      "newAttendantMessage",
      (newMessageData: IMessage) => {
        if (
          currentConversationIdRef.current === newMessageData.conversation_id
        ) {
          setChatData((prevChatData) => [...prevChatData, newMessageData]);
        }

        if (botUsersRedirectedToAttendantRef.current) {
          const updatedBotUserList =
            botUsersRedirectedToAttendantRef.current.map((botUser) => {
              if (
                botUser.conversationId === newMessageData.conversation_id &&
                (newMessageData.status || newMessageData.status === null) &&
                newMessageData.content &&
                newMessageData.created_at &&
                (newMessageData.sid || newMessageData.sid === null) &&
                (newMessageData.media_type ||
                  newMessageData.media_type === null)
              ) {
                return {
                  ...botUser,
                  lastMessageStatus: newMessageData.status,
                  lastMessageContent: newMessageData.content,
                  lastMessageCreatedAt: newMessageData.created_at,
                  lastMessageSid: newMessageData.sid,
                  lastMessageMediaType: newMessageData.media_type,
                };
              }
              return botUser;
            });

          const orderedBotUserList = updatedBotUserList.sort((a, b) =>
            a.lastMessageCreatedAt > b.lastMessageCreatedAt ? -1 : 1
          );

          setBotUsersRedirectedToAttendant(orderedBotUserList);
        } else if (botUsersRedirectedToLecturerRef.current) {
          const updatedBotUserList =
            botUsersRedirectedToLecturerRef.current.map((botUser) => {
              if (
                botUser.conversationId === newMessageData.conversation_id &&
                (newMessageData.status || newMessageData.status === null) &&
                newMessageData.content &&
                newMessageData.created_at &&
                (newMessageData.sid || newMessageData.sid === null) &&
                (newMessageData.media_type ||
                  newMessageData.media_type === null)
              ) {
                return {
                  ...botUser,
                  lastMessageStatus: newMessageData.status,
                  lastMessageContent: newMessageData.content,
                  lastMessageCreatedAt: newMessageData.created_at,
                  lastMessageSid: newMessageData.sid,
                  lastMessageMediaType: newMessageData.media_type,
                };
              }
              return botUser;
            });

          const orderedBotUserList = updatedBotUserList.sort((a, b) =>
            a.lastMessageCreatedAt > b.lastMessageCreatedAt ? -1 : 1
          );

          setBotUsersRedirectedToLecturer(orderedBotUserList);
        }
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

        if (botUsersRedirectedToAttendantRef.current) {
          setBotUsersRedirectedToAttendant((prev) => {
            if (prev) {
              return prev.filter(
                (user) => user.conversationId !== conversationId
              );
            }

            return null;
          });
        } else if (botUsersRedirectedToLecturerRef.current) {
          setBotUsersRedirectedToLecturer((prev) => {
            if (prev) {
              return prev.filter(
                (user) => user.conversationId !== conversationId
              );
            }

            return null;
          });
        }
      }
    );

    socketContext.socket.on(
      "newMessageStatus",
      (messageData: Partial<IMessage>) => {
        if (currentConversationIdRef.current === messageData.conversation_id) {
          const updatedMessages = chatDataRef.current.map((message) => {
            if (
              messageData.sid &&
              message.sid === messageData.sid &&
              messageData.status
            ) {
              return { ...message, status: messageData.status };
            }
            return message;
          });

          setChatData(updatedMessages);
        }

        if (botUsersRedirectedToAttendantRef.current) {
          const updatedBotUserList =
            botUsersRedirectedToAttendantRef.current.map((botUser) => {
              if (
                botUser.lastMessageSid === messageData.sid &&
                messageData.status
              ) {
                return { ...botUser, lastMessageStatus: messageData.status };
              }
              return botUser;
            });

          setBotUsersRedirectedToAttendant(updatedBotUserList);
        } else if (botUsersRedirectedToLecturerRef.current) {
          const updatedBotUserList =
            botUsersRedirectedToLecturerRef.current.map((botUser) => {
              if (
                botUser.lastMessageSid === messageData.sid &&
                messageData.status
              ) {
                return { ...botUser, lastMessageStatus: messageData.status };
              }
              return botUser;
            });

          setBotUsersRedirectedToLecturer(updatedBotUserList);
        }
      }
    );

    socketContext.socket.on(
      "applyAttendantToServe",
      ({ conversationId, attendantId }) => {
        console.log(
          conversationId,
          attendantId,
          currentConversationIdRef.current
        );

        if (currentConversationIdRef.current === conversationId) {
          setCurrentBotUserServedBy(attendantId);
        }

        if (botUsersRedirectedToAttendantRef.current) {
          const newBotUserList = botUsersRedirectedToAttendantRef.current.map(
            (botUser) => {
              if (botUser.conversationId === conversationId) {
                return { ...botUser, servedBy: attendantId };
              }
              return botUser;
            }
          );

          setBotUsersRedirectedToAttendant(newBotUserList);
        }
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
      socketContext?.socket?.off("applyAttendantToServe");
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

  async function handleStartServing(conversationId: number) {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/serve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ attendantId: userContext?.user?.id }),
        }
      );

      const responseObj = await response.json();

      if (response.ok) {
        if (responseObj.data && userContext?.user?.id) {
          const attendantId = userContext.user.id;

          if (currentConversationId === conversationId) {
            setCurrentBotUserServedBy(attendantId);
          }

          setBotUsersRedirectedToAttendant((prev) => {
            if (prev !== null) {
              return prev.map((botUser) => {
                if (botUser.conversationId === conversationId) {
                  return { ...botUser, servedBy: attendantId };
                }
                return botUser;
              });
            }

            return null;
          });
        }
      } else {
        throw responseObj.error;
      }
    } catch (error: any) {
      console.error(error.name, error.message);
    }
  }

  /* const moveElement = (array: any, fromIndex: number, toIndex: number) => {
    const element = array.splice(fromIndex, 1)[0];

    array.splice(toIndex, 0, element);

    return array;
  }; */

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
        setBotUsersRedirectedToAttendant((prev) => {
          if (prev !== null) {
            return prev.filter(
              (user) => user.conversationId !== currentConversationId
            );
          }
          return null;
        });

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
          botUsersList={botUsersRedirectedToAttendant}
          botUsersListForLecturer={botUsersRedirectedToLecturer}
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
            botUserServedBy={currentBotUserServedBy}
            newBotUserMessageCount={newBotUserMessageCount}
            unsetNewBotUserMessageCount={handleUnsetCount}
            onCloseChat={exitConversation}
            isAnUnreadConversation={handleIsAnUnreadConversation}
            onMarkAsUnread={handleMarkAsUnread}
            onTextAreaChange={handleTextAreaChange}
            initialMessage={handleInitialMessage}
            attendantName={user.username}
            loadOlderMessages={fetchChatDataFromThreeDays}
            hasLoadedOlderMessages={hasFetchedOlderMessages}
            onStartServing={handleStartServing}
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
