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
}

function RealTimeChat(props: ChatProps) {
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
      <input type="text" />
    </div>
  );
}

export default RealTimeChat;
