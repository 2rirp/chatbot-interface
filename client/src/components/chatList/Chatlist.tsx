import "./Chatlist.css";
interface Chat {
  id: string;
  last_conversation_created_at: string;
}

interface ChatListProps {
  users: Chat[];
  onUserClick: (userId: string) => void;
}

function ChatList(props: ChatListProps) {
  return (
    <div className="chatlist-container">
      <div className="chatlist">
        <ul>
          {props.users.map((user) => (
            <li key={user.id} onClick={() => props.onUserClick(user.id)}>
              <div>{user.id}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ChatList;
