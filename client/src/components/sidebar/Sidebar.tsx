import "./sidebar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";
import DropdownMenu from "../dropdownMenu/dropdownMenu";
import IBotUser from "../../interfaces/ibotUser";
import DateInput from "../dateInput/DateInput";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import { TailSpin } from "react-loading-icons";
import PhoneNumberFormatter from "../phoneNumberFormatter/PhoneNumberFormatter";
import CustomIconButton from "../customIconButton/CustomIconButton";
import UserDropdownMenu from "../userDropdownMenu/userDropdownMenu";
import PagesType from "../../interfaces/pagesName";

interface SidebarProps {
  currentPage: keyof PagesType;
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
  onMarkAsUnread?: (conversationId: number) => void;
  onMarkAsRead?: (conversationId: number) => void;
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
    if (searchQuery.trim() !== "") {
      setIsSearchingUsers(true);
      filterUsers(searchQuery, props.botUsersList);
    } else {
      setIsSearchingUsers(false);
    }
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

  useEffect(() => {
    if (search.trim() !== "") {
      setIsSearchingUsers(true);
      filterUsers(search, props.botUsersList);
    } else {
      setIsSearchingUsers(false);
    }
  }, [props.botUsersList]);

  return (
    <div className="sidebar">
      <div className="pattern-header sidebar-header">
        <p className="attendant-name">{user.username}</p>

        {props.currentPage === "real_time_page" && (
          <DropdownMenu
            currentPage={props.currentPage}
            isActive={props.isActive}
            handleRegister={props.onRegisterClick}
            handleHistoryPage={props.onHistoryPageClick}
            handleReportPage={props.onReportClick}
            handleLogout={props.onLogoutClick}
          />
        )}

        {props.currentPage === "history_page" && (
          <DateInput handleDateChange={handleDateChange} />
        )}

        {props.currentPage === "history_page" && (
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
              <CustomIconButton
                className="input-icon input-icon-left"
                onClick={() => inputRef.current?.focus()}
              >
                <SearchIcon />
              </CustomIconButton>
            ) : (
              <CustomIconButton
                className="input-icon input-icon-left"
                onClick={cancelSearch}
              >
                <ArrowBackIcon />
              </CustomIconButton>
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
                  <CustomIconButton
                    className="input-icon input-icon-right"
                    onClick={cancelSearch}
                  >
                    <ClearIcon />
                  </CustomIconButton>
                )
              )}
            </div>
          )}
        </div>
        {props.botUsersList.length > 0 ? (
          displayUsers.length > 0 ? (
            props.currentPage === "real_time_page" ? (
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
                    {props.currentPage === "real_time_page" &&
                      botUser.conversationId &&
                      props.onMarkAsUnread &&
                      props.onMarkAsRead && (
                        <UserDropdownMenu
                          currentPage={props.currentPage}
                          className="user-dropdown-menu"
                          conversationId={botUser.conversationId}
                          isAnUnreadConversation={
                            botUser.conversationId &&
                            props.unreadConversations?.includes(
                              botUser.conversationId
                            )
                              ? true
                              : false
                          }
                          onMarkAsUnread={props.onMarkAsUnread}
                          onMarkAsRead={props.onMarkAsRead}
                        />
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              props.currentPage === "history_page" && (
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
