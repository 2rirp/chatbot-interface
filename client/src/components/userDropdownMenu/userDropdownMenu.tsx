import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CustomIconButton from "../customIconButton/CustomIconButton";
import PagesType from "../../interfaces/pagesName";

interface IProps {
  currentPage: keyof PagesType;
  typeOfService?: "attendant" | "lecturer";
  className?: string;
  conversationId: number;
  isAnUnreadConversation: boolean;
  onMarkAsUnread: (conversationId: number) => void;
  onMarkAsRead: (conversationId: number) => void;
  isItTheAttendantServing?: boolean;
  onSendToInbox: () => void;
}

export default function UserDropdownMenu(props: IProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    event.stopPropagation();
  };

  return (
    <React.Fragment>
      <Tooltip title="Opções">
        <CustomIconButton
          onClick={handleClick}
          className={props.className || ""}
        >
          <KeyboardArrowDownIcon />
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
          !props.isAnUnreadConversation && (
            <MenuItem
              key="mark-as-unread"
              onClick={() => props.onMarkAsUnread(props.conversationId)}
            >
              Marcar como não lida
            </MenuItem>
          )}

        {props.currentPage === "real_time_page" &&
          props.isItTheAttendantServing &&
          props.isAnUnreadConversation && (
            <MenuItem
              key="mark-as-read"
              onClick={() => props.onMarkAsRead(props.conversationId)}
            >
              Marcar como lida
            </MenuItem>
          )}

        {props.currentPage === "real_time_page" &&
          props.typeOfService === "attendant" &&
          props.isItTheAttendantServing && (
            <MenuItem key="redirect-to-inbox" onClick={props.onSendToInbox}>
              Redirecionar para a Caixa
            </MenuItem>
          )}
      </Menu>
    </React.Fragment>
  );
}
