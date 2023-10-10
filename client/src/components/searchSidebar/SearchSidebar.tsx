import "./searchSidebar.css";
import IMessage from "../../interfaces/imessage";
import { useRef, useState } from "react";
import TextFormatter from "../textFormatter/TextFormatter";
import CustomIconButton from "../customIconButton/CustomIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TailSpin } from "react-loading-icons";
import TimestampFormatter from "../timestampFormatter/TimestampFormatter";
import PhoneNumberFormatter from "../phoneNumberFormatter/PhoneNumberFormatter";

interface SearchSidebarProps {
  botUserId: string;
  onSearchQueryChange: (searchQuery: string) => IMessage[] | null;
  onClose: () => void;
  onSearchResultClick: (messageId: number) => void;
}

function SearchSidebar(props: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchingMessages, setMatchingMessages] = useState<IMessage[] | null>(
    null
  );
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const cancelSearch = () => {
    setSearchQuery("");
    setMatchingMessages(null);
    setIsSearching(false);
  };

  const handleSearchBarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const search = event.target.value;
    setSearchQuery(search);
    if (searchQuery.trim() !== "") {
      setIsSearching(true);
      setMatchingMessages(props.onSearchQueryChange(search));
      setIsSearching(false);
    } else {
      setMatchingMessages(null);
    }
  };

  const closeSearchSidebar = () => {
    setSearchQuery("");
    setMatchingMessages(null);
    setIsSearching(false);
    props.onClose();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleSearchResultClick = (messageId: number) => {
    props.onSearchResultClick(messageId);
  };

  return (
    <div className="search-sidebar-container">
      <div className="pattern-header search-sidebar-header">
        <CustomIconButton onClick={closeSearchSidebar}>
          <ClearIcon />
        </CustomIconButton>
        <p>Pesquise Mensagens</p>
      </div>

      <div className="search-sidebar-content">
        <div className="search-sidebar-input-container">
          <div className="left-icon-container">
            {searchQuery === "" && isInputFocused ? (
              <CustomIconButton
                className="input-icon-left"
                onClick={() => inputRef.current?.focus()}
              >
                <SearchIcon />
              </CustomIconButton>
            ) : (
              <CustomIconButton
                className="input-icon-left"
                onClick={cancelSearch}
              >
                <ArrowBackIcon />
              </CustomIconButton>
            )}
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchBarChange}
            className="search-sidebar-input"
            autoFocus={true}
            onFocus={handleInputFocus}
            ref={inputRef}
          />
          <div className="right-icon-container">
            {isSearching ? (
              <TailSpin
                stroke="#000"
                strokeOpacity={0.54}
                height={30}
                className="input-icon input-icon-right"
              />
            ) : (
              !isSearching &&
              searchQuery !== "" && (
                <CustomIconButton
                  className="input-icon input-icon-right"
                  onClick={cancelSearch}
                >
                  <ClearIcon />
                </CustomIconButton>
              )
            )}
          </div>
        </div>
        {matchingMessages !== null && matchingMessages.length > 0 ? (
          matchingMessages.map((message) => (
            <div
              key={message.id}
              className={`${
                message.message_from_bot ? "bot-message" : "user-message"
              } search-result`}
              onClick={() => handleSearchResultClick(message.id)}
            >
              <div className="search-result-date">
                <TimestampFormatter
                  timestamp={message.created_at}
                  returnDate
                  returnTime
                  removeSomeData={["second"]}
                />
              </div>
              <div className="message-content">
                <TextFormatter text={message.content} />
              </div>
            </div>
          ))
        ) : matchingMessages && matchingMessages.length === 0 ? (
          <p className="centered-message-container">
            Nenhuma mensagem encontrada
          </p>
        ) : (
          <p className="centered-message-container">
            {"Pesquise uma mensagem com "}
            <PhoneNumberFormatter phoneNumber={props.botUserId} />
          </p>
        )}
      </div>
    </div>
  );
}

export default SearchSidebar;
