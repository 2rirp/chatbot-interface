import { Fragment, useEffect, useRef, useState } from "react";
import "./chat.css";
import SendIcon from "@mui/icons-material/Send";
import QuickreplyIcon from "@mui/icons-material/Quickreply";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import IMessage from "../../interfaces/imessage";
import AlertDialog from "../alertDialog/alertDialog";
import TextFormatter from "../textFormatter/TextFormatter";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
/* import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; */
import CustomIconButton from "../customIconButton/CustomIconButton";
import PhoneNumberFormatter from "../phoneNumberFormatter/PhoneNumberFormatter";
import ChatDropdownMenu from "../chatDropdownMenu/chatDropdownMenu";
import SearchSidebar from "../searchSidebar/SearchSidebar";
import TimestampFormatter from "../timestampFormatter/TimestampFormatter";
import PagesType from "../../interfaces/pagesName";
import QuickreplySidebar from "../quickReplySidebar/QuickreplySidebar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { formatDateTime } from "../../utils/dateUtils";

interface ChatProps {
  currentPage: keyof PagesType;
  chatData: Array<IMessage>;
  onSendMessage?: (message: string) => void;
  onEndConversation?: () => void;
  userId: string;
  conversationId?: number;
  newBotUserMessageCount?: number;
  unsetNewBotUserMessageCount?: () => void;
  onCloseChat: () => void;
  isAnUnreadConversation?: (conversationId: number | null) => boolean;
  onMarkAsUnread?: (conversationId: number | null) => void;
  onTextAreaChange?: (newMessage: string) => void;
  initialMessage?: () => string;
  onRedirectChat?: (
    conversationId: number | null,
    userId: string | null
  ) => void;
  isItToday?: boolean;
  newConversationStatus?: string | null;
  attendantName?: string;
  loadOlderMessages?: (dateLimit: string) => void;
  hasLoadedOlderMessages?: boolean | null;
}

function Chat(props: ChatProps) {
  const textareaMaxLength: number = 1550;
  const [message, setMessage] = useState<string>("");
  const [userAtBottom, setUserAtBottom] = useState(true);
  const [userAtTop, setUserAtTop] = useState(false);
  const [showEndChatDialog, setShowEndChatDialog] = useState(false);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const [isQuickreplySidebarOpen, setisQuickreplySidebarOpen] = useState(false);
  const [isItMoreThan24HoursAgo, setIsItMoreThan24HoursAgo] = useState<
    boolean | null | undefined
  >(undefined);
  /*   const [isUserScrolling, setIsUserScrolling] = useState(false);*/
  /* const [totalOfResults, setTotalOfResults] = useState<number>(0); */
  /* const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(
    null
  ); */
  /* const [matchingMessages, setMatchingMessages] = useState<IMessage[]>([]); */
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  let num = 0;
  const firstMessage = props.chatData[0];
  const lastMessage = props.chatData[props.chatData.length - 1];
  const provocationMessage =
    'Deseja continuar este atendimento? Para continuar, envie "Sim".';

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputMessage = event.target.value;
    setMessage(inputMessage);
  };

  const handleSendMessage = (textMessage?: string) => {
    if (
      textMessage &&
      textMessage.trim() !== "" &&
      textMessage.length < textareaMaxLength
    ) {
      props.onSendMessage?.(textMessage.trim());
    } else if (message.trim() !== "" && message.length < textareaMaxLength) {
      props.onSendMessage?.(message.trim());
      props.onTextAreaChange?.("");
      setMessage("");
    }
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage();
    }
  };

  const handleScroll = () => {
    const chatContent = chatContentRef.current;

    if (chatContent) {
      const isAtBottom =
        chatContent.scrollTop + chatContent.clientHeight >=
        chatContent.scrollHeight - 100;

      const isAtTop = chatContent.scrollTop < 100;

      setUserAtBottom(isAtBottom);
      setUserAtTop(isAtTop);

      if (isAtBottom) {
        props.unsetNewBotUserMessageCount?.();
      }
    }
  };
  const handleQuickReply = (quickreply: string) => {
    setMessage(quickreply);
  };

  const scrollToBottom = () => {
    const chatContent = chatContentRef.current;

    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
      setUserAtBottom(true);
    }
  };

  const openEndChatDialog = () => {
    setShowEndChatDialog(true);
  };

  const closeEndChatDialog = () => {
    setShowEndChatDialog(false);
  };

  const openSearchSidebar = () => {
    setIsSearchResultVisible(true);
    closeQuickreplySidebar();
  };

  const closeSearchSidebar = () => {
    setIsSearchResultVisible(false);
    /* setMatchingMessages([]); */
  };

  const openQuickreplySidebar = () => {
    setisQuickreplySidebarOpen(true);
    closeSearchSidebar();
  };

  const closeQuickreplySidebar = () => {
    setisQuickreplySidebarOpen(false);
  };

  const searchMessages = (searchQuery: string) => {
    if (searchQuery !== "" && searchQuery.length > 1) {
      const accentsRegex = /[\u0300-\u036f]/gi;

      const filteredMessages = props.chatData.filter((message) =>
        message.content
          .normalize("NFD")
          .replace(accentsRegex, "")
          .toLowerCase()
          .includes(
            searchQuery.normalize("NFD").replace(accentsRegex, "").toLowerCase()
          )
      );

      return filteredMessages;
    } else {
      return null;
    }
  };

  const handleScrollToMessage = (messageId: number) => {
    if (chatContentRef.current) {
      const messageElement = chatContentRef.current.querySelector(
        `[data-message-id="${messageId}"]`
      );

      if (messageElement) {
        messageElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  };

  const isMessageMoreThan24HoursAgo = (firstMessageTimestamp: string) => {
    const firstMessageTime: any = formatDateTime(firstMessageTimestamp);
    const currentTime = formatDateTime(new Date());
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;

    if (currentTime - firstMessageTime > twentyFourHoursInMilliseconds) {
      const reversedChatData = props.chatData.slice().reverse();
      const lastBotUserMessage = reversedChatData.find(
        (message) => !message.message_from_bot
      );
      const lastAttendantMessage = reversedChatData.find(
        (message) => message.message_from_bot
      );

      if (lastBotUserMessage) {
        let startOfWindow = formatDateTime(lastBotUserMessage.created_at);
        let endOfWindow: any = new Date(
          startOfWindow.getTime() + twentyFourHoursInMilliseconds
        );

        if (
          endOfWindow - currentTime > 0 &&
          endOfWindow - currentTime < twentyFourHoursInMilliseconds
        ) {
          setIsItMoreThan24HoursAgo(false);
        } else {
          if (
            lastAttendantMessage &&
            isProvocationMessage(lastAttendantMessage)
          ) {
            setIsItMoreThan24HoursAgo(true);
          } else {
            setIsItMoreThan24HoursAgo(null);
          }
        }
      } else {
        if (
          lastAttendantMessage &&
          isProvocationMessage(lastAttendantMessage)
        ) {
          setIsItMoreThan24HoursAgo(true);
        } else {
          setIsItMoreThan24HoursAgo(null);
        }
      }
    } else {
      setIsItMoreThan24HoursAgo(false);
    }
  };

  const handleProvokeUser = () => {
    handleSendMessage(provocationMessage);
  };

  const isProvocationMessage = (message: IMessage) => {
    return (
      message.content !== provocationMessage ||
      (message.content === provocationMessage && message.status === "failed")
    );
  };

  const handleLoadOlderMessages = (dateLimit: string) => {
    if (props.loadOlderMessages) {
      props.loadOlderMessages(dateLimit);
    }
  };
  /* const handleMatchesCounterChange = () => {
     setTotalOfResults((prevTotal) => prevTotal + 1); 
    console.log("hi");
  }; */

  /* const handleNavigateToPreviousMatch = () => {
    if (selectedResultIndex !== null && selectedResultIndex > 0) {
      setSelectedResultIndex(selectedResultIndex - 1);
    }
  };

  const handleNavigateToNextMatch = () => {
    if (
      selectedResultIndex !== null &&
      selectedResultIndex < totalOfResults - 1
    ) {
      setSelectedResultIndex(selectedResultIndex + 1);
    }
  }; */

  useEffect(() => {
    const chatContent = chatContentRef.current;

    if (chatContent) {
      chatContent.addEventListener("scroll", handleScroll);

      chatContent.scrollTop = chatContent.scrollHeight;
      return () => {
        chatContent.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (userAtBottom) {
      scrollToBottom();
    }

    isMessageMoreThan24HoursAgo(firstMessage.created_at);
  }, [props.chatData]);

  useEffect(() => {
    setMessage(props.initialMessage || "");
  }, [props.initialMessage]);

  useEffect(() => {
    props.onTextAreaChange?.(message);
    resizeTextArea();
  }, [message]);

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="pattern-header chat-header">
          <div className="user-identification-container">
            <PhoneNumberFormatter
              className="bot-user-number"
              phoneNumber={`${props.userId}`}
            />
          </div>

          <div className="icons-container">
            {!isSearchResultVisible && (
              <CustomIconButton onClick={openSearchSidebar}>
                <SearchIcon />
              </CustomIconButton>
            )}

            {/* <div className="right-icon-container">
              {search !== "" && totalOfResults > 0 && (
                <div className="arrow-icons-container">
                  <CustomIconButton>
                    <KeyboardArrowUpIcon />
                  </CustomIconButton>
                  <CustomIconButton>
                    <KeyboardArrowDownIcon />
                  </CustomIconButton>
                </div>
              )}
            </div> */}

            {props.currentPage === "real_time_page" && (
              <ChatDropdownMenu
                currentPage={props.currentPage}
                conversationId={props.conversationId}
                handleCloseChat={props.onCloseChat}
                handleEndChat={openEndChatDialog}
                onMarkAsUnread={props.onMarkAsUnread}
                isAnUnreadConversation={props.isAnUnreadConversation}
              />
            )}

            {props.currentPage === "history_page" && (
              <ChatDropdownMenu
                currentPage={props.currentPage}
                conversationId={lastMessage.conversation_id}
                conversationStatus={
                  props.newConversationStatus || lastMessage.conversation_status
                }
                userId={props.userId}
                handleCloseChat={props.onCloseChat}
                onRedirectChat={props.onRedirectChat}
                isItToday={props.isItToday}
              />
            )}
          </div>
        </div>
        <div className="chat-content-buttons">
          {props.currentPage === "real_time_page" &&
            props.loadOlderMessages &&
            userAtTop &&
            (props.hasLoadedOlderMessages === false ? (
              <button
                className="pattern-button"
                onClick={() =>
                  handleLoadOlderMessages(props.chatData[0].created_at)
                }
              >
                Carregar mensagens antigas
              </button>
            ) : props.hasLoadedOlderMessages === null ? (
              <span className="centered-message">
                Não foi encontrada nenhuma mensagem nos três dias anteriores.
              </span>
            ) : null)}
          <div className="chat-content" ref={chatContentRef}>
            {/* {isUserScrolling && (
              <div className="info-message sticky-info-message">
                <h3>{(num += 1)}ª conversa do dia</h3>
              </div>
            )} */}
            {props.chatData.map((message, index) => (
              <Fragment key={message.id}>
                {(props.currentPage === "history_page" && index === 0) ||
                (props.currentPage === "history_page" &&
                  message.conversation_id !==
                    props.chatData[index - 1]?.conversation_id) ? (
                  <div className="info-message">
                    <h3>{(num += 1)}ª conversa do dia</h3>
                  </div>
                ) : null}

                <div
                  key={message.id}
                  className={`message ${
                    message.message_from_bot ? "bot-message" : "user-message"
                  }`}
                  data-message-id={message.id}
                >
                  {message.media_url && message.media_type && (
                    <div className="media-container">
                      {message.media_type.startsWith("image") ? (
                        <img
                          src={`/media/${props.userId}/${message.conversation_id}/${message.media_url}`}
                          alt="Media"
                        />
                      ) : message.media_type.startsWith("video") ? (
                        <video controls>
                          <source
                            src={`/media/${props.userId}/${message.conversation_id}/${message.media_url}`}
                            type="video/mp4"
                          />
                          Este navegador não suporta exibição de vídeo.
                        </video>
                      ) : message.media_type.startsWith("document") ? (
                        <div>
                          <object
                            data={`/media/${props.userId}/${message.conversation_id}/${message.media_url}`}
                            type="application/pdf"
                          >
                            <p>
                              Este navegador não suporta PDFs. Por favor baixe o
                              PDF para poder visualizá-lo.
                            </p>
                          </object>

                          <IconButton>
                            Baixar arquivo
                            <a
                              href={`/media/${props.userId}/${message.conversation_id}/${message.media_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              <DownloadIcon />
                            </a>
                          </IconButton>
                        </div>
                      ) : message.media_type.startsWith("audio") ? (
                        <audio controls>
                          <source
                            src={`/media/${props.userId}/${message.conversation_id}/${message.media_url}`}
                            type={message.media_type}
                          />
                          Este navegador não suporta exibição de audio.
                        </audio>
                      ) : message.media_type.startsWith("application") ? (
                        <IconButton>
                          Baixar arquivo
                          <a
                            href={`/media/${props.userId}/${message.conversation_id}/${message.media_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <DownloadIcon />
                          </a>
                        </IconButton>
                      ) : (
                        <p>
                          Midía não suportada. Por favor, entre em contato com o
                          suporte.
                        </p>
                      )}
                    </div>
                  )}
                  {message.content !== "" && (
                    <div className="message-content">
                      <TextFormatter text={message.content} />
                    </div>
                  )}
                  <div className="message-bottom">
                    <div className="message-timestamp">
                      {props.currentPage === "real_time_page" ? (
                        <TimestampFormatter
                          timestamp={message.created_at}
                          returnTime
                          returnDate
                          dateDisplayInterval="beforeToday"
                          removeSomeData={["second", "year"]}
                        />
                      ) : (
                        <TimestampFormatter
                          timestamp={message.created_at}
                          returnTime
                          removeSomeData={["second"]}
                        />
                      )}
                    </div>
                    {message.status && message.message_from_bot ? (
                      <div
                        className={`message-status-badge ${
                          message.status === "read"
                            ? "change-message-status-color"
                            : ""
                        }`}
                      >
                        {message.status === "queued" ? (
                          <AccessTimeIcon fontSize="inherit" />
                        ) : message.status === "failed" ? (
                          <CloseIcon fontSize="inherit" />
                        ) : message.status === "sent" ? (
                          <DoneIcon fontSize="inherit" />
                        ) : message.status === "delivered" ||
                          message.status === "read" ? (
                          <DoneAllIcon fontSize="inherit" />
                        ) : (
                          <QuestionMarkIcon fontSize="inherit" />
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>

          {!userAtBottom && (
            <CustomIconButton
              ariaLabel="Rolar para baixo"
              onClick={scrollToBottom}
              className="scroll-to-bottom-button"
              deactivateTransparency
              badgeContent={props.newBotUserMessageCount}
            >
              <KeyboardArrowDownIcon />
            </CustomIconButton>
          )}
        </div>
        {props.currentPage === "real_time_page" &&
          (isItMoreThan24HoursAgo === false ? (
            <div className="chat-input-container">
              {!isQuickreplySidebarOpen && (
                <CustomIconButton
                  ariaLabel="Mensagens rápidas"
                  onClick={openQuickreplySidebar}
                  className="quick-reply-button"
                >
                  <QuickreplyIcon />
                </CustomIconButton>
              )}

              <div className="textarea-container">
                <textarea
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleInputKeyPress}
                  className="chat-textarea"
                  rows={1}
                  ref={textAreaRef}
                />
                {message.length < textareaMaxLength ? (
                  <span className={`textarea-message`}>
                    {message.length}/{textareaMaxLength}
                  </span>
                ) : (
                  <span className={`textarea-message limit-reached`}>
                    Você atingiu o limite de caracteres: {message.length}/
                    {textareaMaxLength}
                  </span>
                )}
              </div>
              <CustomIconButton
                className="send-button"
                onClick={() => handleSendMessage()}
                disabled={message.length > textareaMaxLength}
              >
                <SendIcon />
              </CustomIconButton>
            </div>
          ) : isItMoreThan24HoursAgo ? (
            <div className="chat-content-bottom">
              <p>
                Já faz mais de 24h desde a última vez que esse usuário enviou
                uma mensagem.
                <br />É necessário provocá-lo para que o mesmo envie uma
                mensagem e possamos prosseguir com o atendimento
              </p>
              <button
                className="pattern-button"
                onClick={() => handleProvokeUser()}
              >
                Provocar usuário
              </button>
            </div>
          ) : isItMoreThan24HoursAgo === null ? (
            <div className="chat-content-bottom">
              <p>
                Este usuário já foi provocado. É necessário aguardar uma
                resposta dele para prosseguir com o atendimento.
              </p>
            </div>
          ) : null)}
      </div>

      {props.currentPage === "real_time_page" && props.onEndConversation && (
        <AlertDialog
          mustOpen={showEndChatDialog}
          alertTitle="Encerrar conversa"
          alertDescription="Deseja mesmo encerrar a conversa?"
          firstButtonText="Encerrar"
          handleFirstButton={props.onEndConversation}
          secondButtonText="Cancelar"
          handleSecondButton={closeEndChatDialog}
        />
      )}

      {isSearchResultVisible && (
        <SearchSidebar
          botUserId={props.userId}
          onSearchQueryChange={searchMessages}
          onClose={closeSearchSidebar}
          onSearchResultClick={handleScrollToMessage}
        />
      )}

      {isQuickreplySidebarOpen && (
        <QuickreplySidebar
          onQuickreplyClick={handleQuickReply}
          onClose={closeQuickreplySidebar}
          attendantName={props.attendantName}
        />
      )}
    </div>
  );
}

export default Chat;
