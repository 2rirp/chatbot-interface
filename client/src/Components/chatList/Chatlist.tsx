import React from "react";
import { chats } from "../../mock-db";
import SettingsIcon from "@mui/icons-material/Settings";
import "./Chatlist.css";

const ChatList: React.FC = () => (
  <div className="chatlist-container">
    <div className="header">
      <p>Nome do atendente</p>
      <SettingsIcon />
    </div>
    <div className="chatlist">
      <ul>
        {chats.map((chat) => (
          <li key={chat.id}>
            <div>{chat.name}</div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ChatList;
