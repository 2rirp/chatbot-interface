import { useState } from "react";
import "./realTimeChat.css";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import IMessage from "../../interfaces/imessage";

interface ChatProps {
  chatData: Array<IMessage>;
  onSendMessage: (message: string) => void;
  onEndConversation: ()=>void;
  userId: string;
}

function RealTimeChat(props: ChatProps) {
  const [message, setMessage] = useState("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    props.onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="real-time-chat">
      <div className='real-time-chat-header'> 
        <div className="user-identification-container">
          <h3>{props.userId}</h3>
        </div>
        <div className="end-conversation-button-container">
          <button className="end-conversation" onClick={props.onEndConversation}>Encerrar conversa</button>
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
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={handleMessageChange}
          className="chat-input"
        />
        <IconButton className="send-button" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default RealTimeChat;
