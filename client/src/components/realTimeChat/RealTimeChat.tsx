import { useState } from "react";
import "./chat.css";

interface Message {
  id?: number;
  content: string;
  conversation_id: number;
  created_at?: string;
  message_from_bot: boolean | null;
}

interface ChatProps {
  chatData: Message[];
  onSendMessage: (message: string) => void;
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
    <div className="chat">
      <div className="chat-container">
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
      <div className="bottom-container">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={handleMessageChange}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default RealTimeChat;
