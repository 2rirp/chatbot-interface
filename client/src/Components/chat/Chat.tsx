import "./chat.css";

interface Message {
  message_id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  message_from_bot: boolean | null;
  user_id: string;
  menu: string;
  status: string;
  error_counter: number;
  numero_protocolo: string | null;
  save_cadastro: boolean | null;
}

interface ChatProps {
  chatData: Message[];
}

function Chat(props: ChatProps) {
  return (
    <div className="chat-container">
      {props.chatData.map((message) => (
        <div key={message.message_id}>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Chat;
