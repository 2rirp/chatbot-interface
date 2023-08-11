import "./chat.css";
import SendIcon from '@mui/icons-material/Send';
import IconButton from "@mui/material/IconButton";

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
      <div className="chat-input-container">
        <input type="text" className="chat-input"/>
        <IconButton className="send-button">
          <SendIcon/>
        </IconButton>
      </div>  
    </div>
  );
}

export default RealTimeChat;
