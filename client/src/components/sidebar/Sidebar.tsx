import "./sidebar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";
import DropdownMenu from "../dropdownMenu/dropdownMenu";
import IBotUser from "../../interfaces/ibotUser";
import DateInput from "../dateInput/DateInput";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import { TailSpin } from "react-loading-icons";
import PhoneNumberFormatter from "../phoneNumberFormatter/PhoneNumberFormatter";

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
  const [filteredUsers, setFilteredUsers] = useState<IBotUser[] | null>(null);
  const [displayUsers, setDisplayUsers] = useState<IBotUser[]>(
    props.botUsersList
  );
  const [isSearchingUsers, setIsSearchingUsers] = useState<boolean | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    const searchQuery = event.target.value;
    setSearch(searchQuery);
    setIsSearchingUsers(true);
    filterUsers(searchQuery, props.botUsersList);
  };

  function filterUsers(searchString: string, list: Array<IBotUser>) {
    const filtered = list.filter((item) =>
      item.botUserId.slice(2).toLowerCase().includes(searchString.toLowerCase())
    );

    setIsSearchingUsers(false);
    setFilteredUsers(searchString === "" ? null : filtered);
  }

  function cancelSearch() {
    setSearch("");
    setFilteredUsers(null);
    setIsSearchingUsers(null);
  }

  useEffect(() => {
    setDisplayUsers(
      filteredUsers !== null ? filteredUsers : props.botUsersList
    );
  }, [filteredUsers, props.botUsersList]);

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
        <div className="search-input-container">
          <div className="left-icon-container">
            {search === "" ? (
              <IconButton
                className="input-icon input-icon-left"
                onClick={() => inputRef.current?.focus()}
              >
                <SearchIcon />
              </IconButton>
            ) : (
              <IconButton
                className="input-icon input-icon-left"
                onClick={cancelSearch}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
          </div>
          <input
            type="text"
            placeholder="Pesquise um usuário"
            value={search}
            onChange={handleSearchBarChange}
            className="sidebar-search-bar"
            ref={inputRef}
          />
          {isSearchingUsers !== null && (
            <div className="right-icon-container">
              {isSearchingUsers ? (
                <TailSpin
                  stroke="#000"
                  strokeOpacity={0.54}
                  height={30}
                  className="input-icon input-icon-right"
                />
              ) : (
                !isSearchingUsers &&
                search !== "" && (
                  <IconButton
                    className="input-icon input-icon-right"
                    onClick={cancelSearch}
                  >
                    <ClearIcon />
                  </IconButton>
                )
              )}
            </div>
          )}
        </div>
        {props.botUsersList.length > 0 ? (
          displayUsers.length > 0 ? (
            props.currentPage === "real-time-page" ? (
              <ul>
                {displayUsers.map((botUser) => (
                  <li
                    key={botUser.botUserId}
                    onClick={() => handleUserClick(botUser)}
                    className={
                      botUser.conversationId &&
                      props.unreadConversations?.includes(
                        botUser.conversationId
                      )
                        ? "unread-conversation"
                        : ""
                    }
                  >
                    <PhoneNumberFormatter
                      phoneNumber={`${botUser.botUserId}`}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              props.currentPage === "history-page" && (
                <ul>
                  {displayUsers.map((botUser) => (
                    <li
                      key={botUser.botUserId}
                      onClick={() =>
                        selectBotUserToSeeHistory(botUser.botUserId)
                      }
                    >
                      <PhoneNumberFormatter
                        phoneNumber={`${botUser.botUserId}`}
                      />
                    </li>
                  ))}
                </ul>
              )
            )
          ) : (
            <p className="no-users-message">Nenhum usuário encontrado</p>
          )
        ) : (
          <p className="no-users-message">Não há usuários em atendimento.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
