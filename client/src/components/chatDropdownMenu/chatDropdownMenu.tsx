import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomIconButton from "../customIconButton/CustomIconButton";
import PagesType from "../../interfaces/pagesName";

interface IProps {
  currentPage: keyof PagesType;
  conversationId?: number;
  conversationStatus?: string | null;
  userId?: string;
  handleEndChat?: () => void;
  handleCloseChat: () => void;
  onMarkAsUnread?: (conversationId: number | null) => void;
  isAnUnreadConversation?: (conversationId: number | null) => boolean;
  onRedirectChat?: (
    conversationId: number | null,
    userId: string | null
  ) => void;
  isItToday?: boolean;
  isItTheAttendantServing?: boolean;
}

export default function ChatDropdownMenu(props: IProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title="Opções">
        <CustomIconButton onClick={handleClick}>
          <MoreVertIcon />
        </CustomIconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {props.currentPage === "real_time_page" &&
          props.isItTheAttendantServing &&
          !props.isAnUnreadConversation?.(props.conversationId || null) &&
          props.onMarkAsUnread &&
          props.conversationId !== undefined && (
            <MenuItem
              key="mark-as-unread"
              onClick={() =>
                props.onMarkAsUnread?.(props.conversationId || null)
              }
            >
              Marcar como não lida
            </MenuItem>
          )}

        {props.currentPage === "history_page" && props.isItToday && (
          <MenuItem
            key="redirect-conversation"
            disabled={
              props.conversationStatus &&
              props.conversationStatus !== "talking_to_attendant"
                ? false
                : true
            }
            onClick={() =>
              props.onRedirectChat?.(
                props.conversationId || null,
                props.userId || null
              )
            }
          >
            Redirecionar para atendimento
          </MenuItem>
        )}

        {props.currentPage === "real_time_page" &&
          props.isItTheAttendantServing && (
            <MenuItem key="end-conversation" onClick={props.handleEndChat}>
              Encerrar Conversa
            </MenuItem>
          )}

        <MenuItem key="close-chat" onClick={props.handleCloseChat}>
          Fechar Chat
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
