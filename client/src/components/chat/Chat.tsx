import { useEffect, useRef, useState } from "react";
import "./chat.css";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import IMessage from "../../interfaces/imessage";
import AlertDialog from "../alertDialog/alertDialog";
import TextFormatter from "../textFormatter/TextFormatter";

interface ChatProps {
  currentPage: string;
  chatData: Array<IMessage>;
  onSendMessage?: (message: string) => void;
  onEndConversation?: () => void;
  userId: string;
}

function Chat(props: ChatProps) {
  const [message, setMessage] = useState("");
  const [userAtBottom, setUserAtBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      /*  const messageWithNewlines = message.replace(/\n/g, "\\n"); */
      props.onSendMessage?.(message);
      /*       console.log("Sent the message: " + messageWithNewlines);
       */ setMessage("");
    }
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const [_datePart, timePart] = timestamp.split("T");

    const [hour, minute, _second] = timePart.split(":");

    return `${hour}:${minute}`;
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const wasAtBottom =
        chatContainer.scrollTop + chatContainer.clientHeight >=
        chatContainer.scrollHeight;

      setUserAtBottom(wasAtBottom);
      console.log(
        `ScrollTop: ${chatContainer.scrollTop}, ClientHeight: ${chatContainer.clientHeight}, ScrollHeight: ${chatContainer.scrollHeight}`
      );
      if (userAtBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [props.chatData]);

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="user-identification-container">
          <h3>{props.userId}</h3>
        </div>
        {props.currentPage === "real-time-page" && (
          <div className="end-conversation-button-container">
            {/* <button
            className="end-conversation-button"
            style={{ display: props.showButton }}
            onClick={props.onEndConversation}
          > */}
            {props.onEndConversation && (
              <AlertDialog handleDeactivate={props.onEndConversation} />
            )}
            {/* </button> */}
          </div>
        )}
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {props.chatData.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.message_from_bot ? "bot-message" : "user-message"
            }`}
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
                        Este navegador não suporta PDFs. Por favor baixe o PDF
                        para poder visualizá-lo.
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
                <span>{formatTimestamp(message.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {props.currentPage === "real-time-page" && (
        <div className="chat-input-container">
          <textarea
            /* type="text" */
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleInputKeyPress}
            className="chat-input"
            rows={2}
          />
          <IconButton className="send-button" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default Chat;
