import { useState } from "react";
import "./realTimeChat.css";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import IMessage from "../../interfaces/imessage";

interface ChatProps {
  chatData: Array<IMessage>;
  onSendMessage: (message: string) => void;
  onEndConversation: () => void;
  showButton: string;
  userId: string;
}

function RealTimeChat(props: ChatProps) {
  const [message, setMessage] = useState("");

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      /*  const messageWithNewlines = message.replace(/\n/g, "\\n"); */
      props.onSendMessage(message);
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

  return (
    <div className="real-time-chat">
      <div className="real-time-chat-header">
        <div className="user-identification-container">
          <h3>{props.userId}</h3>
        </div>
        <div className="end-conversation-button-container">
          <button
            className="end-conversation-button"
            style={{ display: props.showButton }}
            onClick={props.onEndConversation}
          >
            Encerrar conversa
          </button>
        </div>
      </div>
      <div className="real-time-chat-container">
        {props.chatData.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.message_from_bot ? "bot-message" : "user-message"
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="real-time-chat-input-container">
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
    </div>
  );
}

export default RealTimeChat;
