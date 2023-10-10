import { Fragment, useEffect, useRef, useState } from "react";
import "./chat.css";
import SendIcon from "@mui/icons-material/Send";
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
}

function Chat(props: ChatProps) {
  const textareaMaxLength: number = 1550;
  const [message, setMessage] = useState<string>("");
  const [userAtBottom, setUserAtBottom] = useState(true);
  const [showEndChatDialog, setShowEndChatDialog] = useState(false);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  /*   const [isUserScrolling, setIsUserScrolling] = useState(false);*/
  /* const [totalOfResults, setTotalOfResults] = useState<number>(0); */
  /* const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(
    null
  ); */
  /* const [matchingMessages, setMatchingMessages] = useState<IMessage[]>([]); */
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  let num = 0;
  const lastMessage = props.chatData[props.chatData.length - 1];

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputMessage = event.target.value;
    setMessage(inputMessage);
    props.onTextAreaChange?.(inputMessage);
    resizeTextArea();
  };

  const handleSendMessage = () => {
    if (message.trim() !== "" && message.length < textareaMaxLength) {
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

      setUserAtBottom(isAtBottom);

      if (isAtBottom) {
        props.unsetNewBotUserMessageCount?.();
      }
    }
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
  };

  const closeSearchSidebar = () => {
    setIsSearchResultVisible(false);
    /* setMatchingMessages([]); */
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
  }, [props.chatData]);

  useEffect(() => {
    setMessage(props.initialMessage || "");
  }, [props.initialMessage]);

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
                  props.newConversationStatus || lastMessage.status
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
          <div className="chat-content" ref={chatContentRef}>
            {/* {isUserScrolling && (
              <div className="info-message sticky-info-message">
                <h3>{(num += 1)}ª conversa do dia</h3>
              </div>
            )} */}
            {props.chatData.map((message, index) => (
              <Fragment key={message.id}>
                {index === 0 ||
                (message.conversation_id !==
                  props.chatData[index - 1]?.conversation_id &&
                  props.currentPage === "history_page") ? (
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
                  {message.media_url && (
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
                      <TimestampFormatter
                        timestamp={message.created_at}
                        returnTime
                        removeSomeData={["second"]}
                      />
                    </div>
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
        {props.currentPage === "real_time_page" && (
          <div className="chat-input-container">
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
              onClick={handleSendMessage}
              disabled={message.length > textareaMaxLength}
            >
              <SendIcon />
            </CustomIconButton>
          </div>
        )}
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
    </div>
  );
}

export default Chat;
