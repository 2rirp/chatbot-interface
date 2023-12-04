import "./sidebar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { UserContext } from "../../contexts/UserContext";
import DropdownMenu from "../dropdownMenu/dropdownMenu";
import IBotUser from "../../interfaces/ibotUser";
import DateInput from "../dateInput/DateInput";
import SearchIcon from "@mui/icons-material/Search";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import { TailSpin } from "react-loading-icons";
import PhoneNumberFormatter from "../phoneNumberFormatter/PhoneNumberFormatter";
import CustomIconButton from "../customIconButton/CustomIconButton";
import UserDropdownMenu from "../userDropdownMenu/userDropdownMenu";
import PagesType from "../../interfaces/pagesName";
import TimestampFormatter from "../timestampFormatter/TimestampFormatter";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import MicIcon from "@mui/icons-material/Mic";
import UnreadIndicator from "./unreadIndicator/UnreadIndicator";
/* import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"; */

interface SidebarProps {
  currentPage: keyof PagesType;
  fetchChatData?: (
    conversationId: number,
    botUserId: string,
    servedBy: number | null
  ) => Promise<void>;
  fetchChatDataByDate?: (userId: string) => Promise<void>;
  onDataChange?: (date: string) => void;
  onRegisterClick: () => void;
  onHistoryPageClick?: () => void;
  onChatPageClick?: () => void;
  onLogoutClick: () => void;
  onReportClick: () => void;
  isActive: boolean;
  botUsersList: Array<IBotUser> | null;
  botUsersListForLecturer?: Array<IBotUser> | null;
  unreadConversations?: Array<number>;
  onMarkAsUnread?: (conversationId: number) => void;
  onMarkAsRead?: (conversationId: number) => void;
  onNewConversation?: () => void;
}

function Sidebar(props: SidebarProps) {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<IBotUser[] | null>(null);
  const [displayUsers, setDisplayUsers] = useState<IBotUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState<boolean | null>(
    null
  );
  /*  const [isListVisible, setListVisible] = useState(true); */
  /* const [listHeight, setListHeight] = useState("auto"); */
  const inputRef = useRef<HTMLInputElement | null>(null);

  const user = {
    username: userContext?.user?.name || "",
    id: userContext?.user?.id || "",
    isAdmin: userContext?.user?.is_admin || "",
    isAttendant: userContext?.user?.is_attendant || "",
    isLecturer: userContext?.user?.is_lecturer || "",
  };

  async function handleUserClick(botUser: IBotUser) {
    socketContext?.socket?.emit(
      "enterConversation",
      botUser.botUserId,
      botUser.conversationId,
      userContext?.user?.id
    );
    if (botUser.conversationId) {
      await props.fetchChatData?.(
        botUser.conversationId,
        botUser.botUserId,
        botUser.servedBy
      );
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
      filterUsers(
        searchQuery,
        props.botUsersList || props.botUsersListForLecturer || []
      );
    } else {
      setIsSearchingUsers(false);
    }
  };

  const filterUsers = (searchString: string, list: Array<IBotUser>) => {
    const filtered = list.filter((item) =>
      item.botUserId.slice(2).toLowerCase().includes(searchString.toLowerCase())
    );

    setIsSearchingUsers(false);
    setFilteredUsers(searchString === "" ? null : filtered);
  };

  const cancelSearch = () => {
    setSearch("");
    setFilteredUsers(null);
    setIsSearchingUsers(null);
  };

  /*  const toggleListVisibility = () => {
    setListVisible((prevState) => !prevState);
  }; */

  useEffect(() => {
    setDisplayUsers(
      filteredUsers !== null
        ? filteredUsers
        : props.botUsersList || props.botUsersListForLecturer || []
    );
  }, [filteredUsers, props.botUsersList]);

  useEffect(() => {
    if (search.trim() !== "") {
      setIsSearchingUsers(true);
      filterUsers(
        search,
        props.botUsersList || props.botUsersListForLecturer || []
      );
    } else {
      setIsSearchingUsers(false);
    }
  }, [props.botUsersList, props.botUsersListForLecturer]);

  /* useEffect(() => {
    setListHeight(isListVisible ? "auto" : "0");
  }, [isListVisible]); */

  useEffect(() => {
    if (props.botUsersList) {
      setDisplayUsers(props.botUsersList);
    } else if (props.botUsersListForLecturer) {
      setDisplayUsers(props.botUsersListForLecturer);
    }
  }, [props.botUsersList, props.botUsersListForLecturer]);

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
          {user.isLecturer === true && (
            <CustomIconButton
              className="start-new-conversation-button"
              onClick={props.onNewConversation}
            >
              <AddCommentIcon />
            </CustomIconButton>
          )}
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
        {/* <div className="list-title" onClick={toggleListVisibility}>
          <span>Caixa de Entrada</span>
          {isListVisible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div> */}
        {(props.botUsersList && props.botUsersList.length > 0) ||
        (props.botUsersListForLecturer &&
          props.botUsersListForLecturer.length > 0) ? (
          displayUsers.length > 0 ? (
            props.currentPage === "real_time_page" ? (
              <ul
              /* className={`collapsible-list ${isListVisible ? "" : "closed"}`} */
              /* style={{ height: listHeight }} */
              >
                {displayUsers.map((botUser) => (
                  <li
                    key={botUser.botUserId}
                    onClick={() => handleUserClick(botUser)}
                    /* className={
                      botUser.conversationId &&
                      props.unreadConversations?.includes(
                        botUser.conversationId
                      )
                        ? "unread-conversation"
                        : ""
                    } */
                  >
                    <div className="user-details">
                      <PhoneNumberFormatter
                        phoneNumber={`${botUser.botUserId}`}
                        className="formatted-number"
                      />

                      {botUser.lastMessageCreatedAt && (
                        <TimestampFormatter
                          timestamp={botUser.lastMessageCreatedAt}
                          returnTime
                          returnDate
                          dateDisplayInterval="beforeToday"
                          removeSomeData={["second", "year"]}
                        />
                      )}
                    </div>

                    <div className="message-details">
                      <div className="message-part">
                        {botUser.lastMessageStatus && (
                          <div
                            className={`message-status-badge ${
                              botUser.lastMessageStatus === "read"
                                ? "change-message-status-color"
                                : ""
                            }`}
                          >
                            {botUser.lastMessageStatus === "queued" ? (
                              <AccessTimeIcon fontSize="inherit" />
                            ) : botUser.lastMessageStatus === "failed" ? (
                              <CloseIcon fontSize="inherit" />
                            ) : botUser.lastMessageStatus === "sent" ? (
                              <DoneIcon fontSize="inherit" />
                            ) : botUser.lastMessageStatus === "delivered" ||
                              botUser.lastMessageStatus === "read" ? (
                              <DoneAllIcon fontSize="inherit" />
                            ) : null}
                          </div>
                        )}

                        {botUser.lastMessageMediaType && (
                          <div className="message-media-icon">
                            {botUser.lastMessageMediaType.startsWith(
                              "image"
                            ) ? (
                              <InsertPhotoIcon fontSize="inherit" />
                            ) : botUser.lastMessageMediaType.startsWith(
                                "video"
                              ) ? (
                              <VideocamIcon fontSize="inherit" />
                            ) : botUser.lastMessageMediaType.startsWith(
                                "audio"
                              ) ? (
                              <MicIcon fontSize="inherit" />
                            ) : botUser.lastMessageMediaType.startsWith(
                                "document" ||
                                  botUser.lastMessageMediaType.startsWith(
                                    "document"
                                  )
                              ) ? (
                              <ArticleIcon fontSize="inherit" />
                            ) : null}
                          </div>
                        )}

                        {botUser.lastMessageContent && (
                          <span
                            className="message-preview"
                            ref={(el) => {
                              if (el) {
                                el.style.width =
                                  el.scrollWidth > el.clientWidth
                                    ? "90%"
                                    : "auto";
                              }
                            }}
                          >
                            {botUser.lastMessageContent}
                          </span>
                        )}
                      </div>

                      <div className="icons-part">
                        {botUser.conversationId &&
                        props.unreadConversations?.includes(
                          botUser.conversationId
                        ) ? (
                          <UnreadIndicator />
                        ) : null}

                        {props.currentPage === "real_time_page" &&
                          botUser.conversationId &&
                          props.onMarkAsUnread &&
                          props.onMarkAsRead &&
                          botUser.servedBy === userContext?.user?.id && (
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
                              isItTheAttendantServing={
                                botUser.servedBy === userContext?.user?.id
                              }
                            />
                          )}
                      </div>
                    </div>
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
