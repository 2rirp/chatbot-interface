import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
  mustOpen: boolean;
  alertTitle: string;
  alertDescription?: string;
  firstButtonText: string;
  secondButtonText?: string;
  handleFirstButton: () => void;
  handleSecondButton?: () => void;
}

export default function AlertDialog(props: IProps) {
  return (
    <Dialog
      open={props.mustOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.alertTitle}</DialogTitle>
      {props.alertDescription && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.alertDescription}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={props.handleFirstButton}>
          {props.firstButtonText}
        </Button>
        {props.handleSecondButton && (
          <Button onClick={props.handleSecondButton} autoFocus>
            {props.secondButtonText || null}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
