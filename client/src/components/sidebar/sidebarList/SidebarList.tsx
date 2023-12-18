import "./sidebarList.css";
import IBotUser from "../../../interfaces/ibotUser";
import PhoneNumberFormatter from "../../phoneNumberFormatter/PhoneNumberFormatter";
import TimestampFormatter from "../../timestampFormatter/TimestampFormatter";
import UserDropdownMenu from "../../userDropdownMenu/userDropdownMenu";
import UnreadIndicator from "../unreadIndicator/UnreadIndicator";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import VideocamIcon from "@mui/icons-material/Videocam";
import ArticleIcon from "@mui/icons-material/Article";
import MicIcon from "@mui/icons-material/Mic";
import { UserContext } from "../../../contexts/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import CollapsibleComponent from "../collapsibleComponent/CollapsibleComponent";
import PagesType from "../../../interfaces/pagesName";

interface SidebarListProps {
  currentPage: keyof PagesType;
  botUserList: IBotUser[];
  typeOfService: "attendant" | "lecturer";
  handleLiClick: (botUser: IBotUser) => Promise<void>;
  unreadConversations: number[];
  onMarkAsUnread: (conversationId: number) => void;
  onMarkAsRead: (conversationId: number) => void;
  componentHeight?: (heightValue: number | null) => void;
  onSendToInbox?: (
    conversationsId: number[],
    newServedBy: null
  ) => Promise<void>;
}

interface GroupedBotUsers {
  [key: string]: IBotUser[];
}

export default function SidebarList(props: SidebarListProps) {
  const userContext = useContext(UserContext);
  const [groupedByServedBy, setGroupedByServedBy] = useState<GroupedBotUsers>(
    {}
  );
  const [
    conversationsIdServedByAttendant,
    setConversationsIdServedByAttendant,
  ] = useState<number[]>([]);
  const [listHeight, setListHeight] = useState<number | null>(null);

  const listRef = useRef<HTMLUListElement | null>(null);
  const componentRef = useRef<HTMLDivElement | null>(null);

  const user = {
    username: userContext?.user?.name || "",
    id: userContext?.user?.id || 0,
    isAdmin: userContext?.user?.is_admin || false,
    isAttendant: userContext?.user?.is_attendant || false,
    isLecturer: userContext?.user?.is_lecturer || false,
  };

  const groupByServedBy = () => {
    const listGroupedByServedBy = props.botUserList.reduce(
      (groups: GroupedBotUsers, botUser) => {
        const { servedBy } = botUser;

        const key = servedBy === null ? "0" : `${servedBy}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(botUser);

        return groups;
      },
      {}
    );

    if (props.typeOfService === "attendant") {
      const conversationsId = Object.entries(listGroupedByServedBy)
        .map(([servedBy, botUsers]) => {
          if (parseInt(servedBy) === user.id) {
            return botUsers.map((botUser) => {
              console.log("Teste: ", botUser);
              return botUser.conversationId ? botUser.conversationId : 0;
            });
          }
          return [];
        })
        .flat();

      return { listGroupedByServedBy, conversationsId };
    } else {
      return { listGroupedByServedBy };
    }
  };

  const handleOnSendToInbox = () => {
    props.onSendToInbox?.(conversationsIdServedByAttendant, null);
  };

  useEffect(() => {
    const groupedData = groupByServedBy();
    setGroupedByServedBy(groupedData.listGroupedByServedBy);

    if (groupedData.conversationsId) {
      setConversationsIdServedByAttendant(groupedData.conversationsId);
    }
  }, [props.botUserList]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === listRef.current) {
          /* const listHeight = entry.contentRect.height; */
          listRef.current && setListHeight(entry.contentRect.height);
          /* console.log(`Changed list height ${entry.contentRect.height}`); */
        } else if (entry.target === componentRef.current) {
          /*  const componentHeight = entry.contentRect.height; */
          props.componentHeight &&
            componentRef.current &&
            props.componentHeight(entry.contentRect.height);

          /* console.log(`Changed component height ${entry.contentRect.height}`); */
        }
      }
    });

    if (listRef.current) {
      observer.observe(listRef.current);
    }

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="sidebar-list-container" ref={componentRef}>
      {Object.entries(groupedByServedBy).map(([servedBy, botUsers]) => (
        /* <div key={servedBy}>
          <span>{`${
            servedBy === "0"
              ? "Sem Atendimento"
              : parseInt(servedBy) === user.id
              ? "Atendido por mim"
              : `Atendido por ${servedBy}`
          }`}</span> */

        <CollapsibleComponent
          currentPage={props.currentPage}
          title={`${
            servedBy === "0"
              ? "Caixa de Entrada"
              : parseInt(servedBy) === user.id
              ? "Atendido por mim"
              : `Atendido por ${servedBy}`
          }`}
          showDropdownMenu={
            parseInt(servedBy) === user.id &&
            props.typeOfService === "attendant"
          }
          level={2}
          childrenHeight={listHeight}
          onSendToInbox={handleOnSendToInbox}
        >
          <ul className="sidebar-list" ref={listRef}>
            {botUsers.map((botUser) => (
              <li
                key={botUser.botUserId}
                onClick={() => props.handleLiClick(botUser)}
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
                        {botUser.lastMessageMediaType.startsWith("image") ? (
                          <InsertPhotoIcon fontSize="inherit" />
                        ) : botUser.lastMessageMediaType.startsWith("video") ? (
                          <VideocamIcon fontSize="inherit" />
                        ) : botUser.lastMessageMediaType.startsWith("audio") ? (
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
                              el.scrollWidth > el.clientWidth ? "90%" : "auto";
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

                    {botUser.conversationId &&
                      props.onMarkAsUnread &&
                      props.onMarkAsRead &&
                      botUser.servedBy === user.id && (
                        <UserDropdownMenu
                          currentPage={"real_time_page"}
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
                          isItTheAttendantServing={botUser.servedBy === user.id}
                        />
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CollapsibleComponent>
        /* </div> */
      ))}
    </div>
  );
}
