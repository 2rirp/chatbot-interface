import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import ChatIcon from "@mui/icons-material/Chat";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Logout from "@mui/icons-material/Logout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";
import Box from "@mui/material/Box";
import PagesType from "../../interfaces/pagesName";

interface IProps {
  handleAdminPage: ()=> void;
  currentPage: keyof PagesType;
  handleRegister: () => void;
  handleChatpage?: () => void;
  handleHistoryPage?: () => void;
  handleLogout: () => void;
  handleReportPage: () => void;
  isActive: boolean;
}

export default function DropdownMenu(props: IProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const userContext = useContext(UserContext);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //   const handleSelect = () => {
  //     console.log('Oie')
  //   };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Opções">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disabled={props.isActive}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <MoreVertIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
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
        {userContext?.user?.is_admin && (
          <MenuItem key="register" onClick={props.handleRegister}>
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            Registrar usuário
          </MenuItem>
        )}

        {props.currentPage === "real_time_page" && (
          <MenuItem key="history" onClick={props.handleHistoryPage}>
            <ListItemIcon>
              <EventNoteIcon fontSize="small" />
            </ListItemIcon>
            Histórico de atendimentos
          </MenuItem>
        )}

        {props.currentPage === "history_page" && (
          <MenuItem key="chat" onClick={props.handleChatpage}>
            <ListItemIcon>
              <ChatIcon fontSize="small" />
            </ListItemIcon>
            Chatpage
          </MenuItem>
        )}

        {userContext?.user?.is_admin && (
          <MenuItem key="relatorio" onClick={props.handleReportPage}>
            <ListItemIcon>
              <AssessmentIcon fontSize="small" />
            </ListItemIcon>
            Relatório
          </MenuItem>
        )}
        {userContext?.user?.is_admin && (
          <MenuItem key="adminPage" onClick={props.handleAdminPage}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small"/>
            </ListItemIcon>
            Painel de controle
          </MenuItem>
        )}

        <MenuItem key="logout" onClick={props.handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Deslogar
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
