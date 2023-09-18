import "./sidebar.css";
import { useContext, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext"; // Import your SocketContext
import { UserContext } from "../../contexts/UserContext";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import IconButton from "@mui/material/IconButton";
import DropdownMenu from "../dropdownMenu/dropdownMenu";
import IBotUser from "../../interfaces/ibotUser";
import DateInput from "../dateInput/DateInput";
/* import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material"; */

interface SidebarProps {
  currentPage: string;
  fetchChatData?: (conversationId: number, botUserId: string) => Promise<void>;
  fetchChatDataByDate?: (userId: string) => Promise<void>;
  onDataChange?: (date: string) => void;
  onRegisterClick: () => void;
  onHistoryPageClick?: () => void;
  onChatPageClick?: () => void;
  onLogoutClick: () => void;
  onReportClick: () => void;
  isActive: boolean;
  botUsersList: Array<IBotUser>;
  unreadConversations?: Array<number>;
}

function Sidebar(props: SidebarProps) {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [search, setSearch] = useState("");

  const user = {
    username: userContext?.user?.name || "",
  };

  async function handleUserClick(botUser: IBotUser) {
    socketContext?.socket?.emit(
      "enterConversation",
      botUser.botUserId,
      botUser.conversationId,
      userContext?.user?.id
    );
    if (botUser.conversationId) {
      await props.fetchChatData?.(botUser.conversationId, botUser.botUserId);
    }
  }

  async function selectBotUserToSeeHistory(botUserId: string) {
    await props.fetchChatDataByDate?.(botUserId);
  }

  function handleDateChange(date: string) {
    props.onDataChange?.(date);
  }

  const handleSearchBarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    filterUsers(search, props.botUsersList);
  };

  function filterUsers(searchString: string, list: Array<IBotUser>) {
    const filteredUsers = list.filter((item) => {
      if (searchString === "") {
        return item;
      } else {
        return item.botUserId.toLowerCase().includes(searchString);
      }
    });
    console.log(filteredUsers);
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p className="attendant-name">{user.username}</p>

        {props.currentPage === "real-time-page" && (
          <DropdownMenu
            currentPage={props.currentPage}
            isActive={props.isActive}
            handleRegister={props.onRegisterClick}
            handleHistoryPage={props.onHistoryPageClick}
            handleReportPage={props.onReportClick}
            handleLogout={props.onLogoutClick}
          />
        )}

        {props.currentPage === "history-page" && (
          <DateInput handleDateChange={handleDateChange} />
        )}

        {props.currentPage === "history-page" && (
          <DropdownMenu
            currentPage={props.currentPage}
            isActive={props.isActive}
            handleRegister={props.onRegisterClick}
            handleChatpage={props.onChatPageClick}
            handleReportPage={props.onReportClick}
            handleLogout={props.onLogoutClick}
          />
        )}
      </div>
      <div className="sidebar-container">
        <input
          type="text"
          placeholder="Pesquise um usuário"
          onChange={handleSearchBarChange}
          className="sidebar-search-bar"
        />
        {/*  <IconButton>
          <SearchIcon />
        </IconButton> */}
        {props.botUsersList.length > 0 ? (
          props.currentPage === "real-time-page" ? (
            <ul>
              {props.botUsersList.map((botUser) => (
                <li
                  key={botUser.botUserId}
                  onClick={() => handleUserClick(botUser)}
                  className={
                    botUser.conversationId &&
                    props.unreadConversations?.includes(botUser.conversationId)
                      ? "unread-conversation"
                      : ""
                  }
                >
                  <div>{botUser.botUserId}</div>
                </li>
              ))}
            </ul>
          ) : (
            props.currentPage === "history-page" && (
              <ul>
                {props.botUsersList.map((botUser) => (
                  <li
                    key={botUser.botUserId}
                    onClick={() => selectBotUserToSeeHistory(botUser.botUserId)}
                  >
                    <div>{botUser.botUserId}</div>
                  </li>
                ))}
              </ul>
            )
          )
        ) : (
          <p className="no-users-message">Não há usuários em atendimento.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
