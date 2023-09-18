import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IProps {
    handleDeactivate: () => void;
    // isOpen: boolean;
}

export default function AlertDialog(props: IProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={{
        background: "#d8646eb9",
        color: "#000000b8",
      }}>
        Encerrar conversa
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Encerrar conversa"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           Deseja mesmo encerrar a conversa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleDeactivate}>Encerrar</Button>
          <Button onClick={handleClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
