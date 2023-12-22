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
import CustomIconButton from "../customIconButton/CustomIconButton";
import PagesType from "../../interfaces/pagesName";
import SidebarList from "./sidebarList/SidebarList";
import React from "react";
import CollapsibleComponent from "./collapsibleComponent/CollapsibleComponent";

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
  onSendToInbox?: (
    conversationsId: number | number[],
    newServedBy: null
  ) => Promise<void>;
}

function Sidebar(props: SidebarProps) {
  const socketContext = useContext(SocketContext);
  const userContext = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [filteredListOne, setFilteredListOne] = useState<IBotUser[] | null>(
    null
  );
  const [displayListOne, setDisplayListOne] = useState<IBotUser[]>([]);
  const [filteredListTwo, setFilteredListTwo] = useState<IBotUser[] | null>(
    null
  );
  const [displayListTwo, setDisplayListTwo] = useState<IBotUser[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState<boolean | null>(
    null
  );

  const [sidebarOneHeight, setSidebarOneHeight] = useState<number | null>(null);
  const [sidebarTwoHeight, setSidebarTwoHeight] = useState<number | null>(null);
  /*  const [isListVisible, setListVisible] = useState(true); */
  /* const [listHeight, setListHeight] = useState("auto"); */
  const inputRef = useRef<HTMLInputElement | null>(null);

  const user = {
    username: userContext?.user?.name || "",
    id: userContext?.user?.id || "",
    isAdmin: userContext?.user?.is_admin || false,
    isAttendant: userContext?.user?.is_attendant || false,
    isLecturer: userContext?.user?.is_lecturer || false,
  };

  async function handleUserClick(botUser: IBotUser | string) {
    if (typeof botUser === "string") return;

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

  async function selectBotUserToSeeHistory(botUserId: string | IBotUser) {
    if (typeof botUserId !== "string") return;
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
      if (props.botUsersList) filterUsers(searchQuery, props.botUsersList, 1);

      if (props.botUsersListForLecturer)
        filterUsers(searchQuery, props.botUsersListForLecturer, 2);
    } else {
      setIsSearchingUsers(false);
    }
  };

  const filterUsers = (
    searchString: string,
    list: Array<IBotUser>,
    whichListSearch: 1 | 2
  ) => {
    const filtered = list.filter((item) =>
      item.botUserId.slice(2).toLowerCase().includes(searchString.toLowerCase())
    );

    setIsSearchingUsers(false);

    switch (whichListSearch) {
      case 1:
        setFilteredListOne(searchString === "" ? null : filtered);
        break;
      case 2:
        setFilteredListTwo(searchString === "" ? null : filtered);
        break;
      default:
        break;
    }
  };

  const cancelSearch = () => {
    setSearch("");
    setFilteredListOne(null);
    setFilteredListTwo(null);
    setIsSearchingUsers(null);
  };

  const changeComponentHeight = (
    heightValue: number | null,
    whichListUpdate: 1 | 2
  ) => {
    switch (whichListUpdate) {
      case 1:
        setSidebarOneHeight(heightValue);
        break;
      case 2:
        setSidebarTwoHeight(heightValue);
        break;
      default:
        break;
    }
  };

  /*  const toggleListVisibility = () => {
    setListVisible((prevState) => !prevState);
  }; */

  useEffect(() => {
    setDisplayListOne(
      filteredListOne !== null ? filteredListOne : props.botUsersList || []
    );
  }, [filteredListOne, props.botUsersList]);

  useEffect(() => {
    setDisplayListTwo(
      filteredListTwo !== null
        ? filteredListTwo
        : props.botUsersListForLecturer || []
    );
  }, [filteredListTwo, props.botUsersListForLecturer]);

  useEffect(() => {
    if (search.trim() !== "") {
      setIsSearchingUsers(true);
      if (props.botUsersList) filterUsers(search, props.botUsersList, 1);

      if (props.botUsersListForLecturer)
        filterUsers(search, props.botUsersListForLecturer, 2);
    } else {
      setIsSearchingUsers(false);
    }
  }, [props.botUsersList, props.botUsersListForLecturer]);

  /* useEffect(() => {
    setListHeight(isListVisible ? "auto" : "0");
  }, [isListVisible]); */

  useEffect(() => {
    if (props.botUsersList) {
      setDisplayListOne(props.botUsersList);
    } else if (props.botUsersListForLecturer) {
      setDisplayListTwo(props.botUsersListForLecturer);
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
        <div className="sidebar-icons-container">
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
          {props.currentPage === "real_time_page" &&
            (user.isLecturer || user.isAdmin) && (
              <CustomIconButton
                className="start-new-conversation-button"
                onClick={props.onNewConversation}
              >
                <AddCommentIcon />
              </CustomIconButton>
            )}
        </div>
        <div className="sidebar-content">
          {(props.botUsersList && props.botUsersList.length > 0) ||
          (props.botUsersListForLecturer &&
            props.botUsersListForLecturer.length > 0) ? (
            displayListOne.length > 0 || displayListTwo.length > 0 ? (
              props.currentPage === "real_time_page" &&
              props.unreadConversations &&
              props.onMarkAsRead &&
              props.onMarkAsUnread ? (
                <React.Fragment>
                  {props.botUsersList &&
                    (props.botUsersList.length > 0 ? (
                      displayListOne.length > 0 ? (
                        props.botUsersList && props.botUsersListForLecturer ? (
                          <CollapsibleComponent
                            currentPage={props.currentPage}
                            title="Perfil de Atendente"
                            level={1}
                            childrenHeight={sidebarOneHeight}
                          >
                            <SidebarList
                              currentPage={props.currentPage}
                              botUserList={displayListOne}
                              typeOfService="attendant"
                              handleLiClick={handleUserClick}
                              unreadConversations={props.unreadConversations}
                              onMarkAsRead={props.onMarkAsRead}
                              onMarkAsUnread={props.onMarkAsUnread}
                              onSendToInbox={props.onSendToInbox}
                              componentHeight={(heightValue) =>
                                changeComponentHeight(heightValue, 1)
                              }
                            />
                          </CollapsibleComponent>
                        ) : (
                          <SidebarList
                            currentPage={props.currentPage}
                            botUserList={displayListOne}
                            typeOfService="attendant"
                            handleLiClick={handleUserClick}
                            unreadConversations={props.unreadConversations}
                            onMarkAsRead={props.onMarkAsRead}
                            onMarkAsUnread={props.onMarkAsUnread}
                            onSendToInbox={props.onSendToInbox}
                          />
                        )
                      ) : (
                        <p className="no-users-message">
                          Nenhum usuário encontrado
                        </p>
                      )
                    ) : (
                      <p className="no-users-message">
                        Não há usuários em atendimento com os atendentes.
                      </p>
                    ))}

                  {props.botUsersListForLecturer &&
                    (props.botUsersListForLecturer.length > 0 ? (
                      displayListTwo.length > 0 ? (
                        props.botUsersList && props.botUsersListForLecturer ? (
                          <CollapsibleComponent
                            currentPage={props.currentPage}
                            title="Perfil de Conferente"
                            level={1}
                            childrenHeight={sidebarTwoHeight}
                          >
                            <SidebarList
                              currentPage={props.currentPage}
                              botUserList={displayListTwo}
                              typeOfService="lecturer"
                              handleLiClick={handleUserClick}
                              unreadConversations={props.unreadConversations}
                              onMarkAsRead={props.onMarkAsRead}
                              onMarkAsUnread={props.onMarkAsUnread}
                              componentHeight={(heightValue) =>
                                changeComponentHeight(heightValue, 2)
                              }
                              onSendToInbox={props.onSendToInbox}
                            />
                          </CollapsibleComponent>
                        ) : (
                          <SidebarList
                            currentPage={props.currentPage}
                            botUserList={displayListTwo}
                            typeOfService="lecturer"
                            handleLiClick={handleUserClick}
                            unreadConversations={props.unreadConversations}
                            onMarkAsRead={props.onMarkAsRead}
                            onMarkAsUnread={props.onMarkAsUnread}
                          />
                        )
                      ) : (
                        <p className="no-users-message">
                          Nenhum usuário encontrado
                        </p>
                      )
                    ) : (
                      <p className="no-users-message">
                        Não há usuários em atendimento na conferência.
                      </p>
                    ))}
                </React.Fragment>
              ) : (
                props.currentPage === "history_page" && (
                  <SidebarList
                    currentPage={props.currentPage}
                    botUserList={displayListOne}
                    handleLiClick={selectBotUserToSeeHistory}
                  />
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
    </div>
  );
}

export default Sidebar;
