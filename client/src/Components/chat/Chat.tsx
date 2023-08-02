import "./chat.css";

interface Message {
  message_id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  message_from_bot: boolean | null;
  user_id: string;
}

interface ChatProps {
  chatData: Message[];
}

function Chat(props: ChatProps) {
  return (
    <div className="chat">
      <div className="chat-container">
        {props.chatData.map((message) => (
          <div
            key={message.message_id}
            className={`message ${
              message.message_from_bot ? "bot-message" : "user-message"
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
