import UsersTable from "../UsersTable";
import "./modal.css";

interface IReportUsers {
  id: number;
  date?: string;
  user_id?: string;
  status?: string;
  emitida: boolean;
}

interface modalProps {
  onClose: () => void;
  data: IReportUsers[];
}

export default function Modal(props: modalProps) {
  function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }
  return (
    <div className="modal-background" onClick={props.onClose}>
      <div className="form-container" onClick={stopPropagation}>
        <UsersTable fetchedData={props.data} />
      </div>
    </div>
  );
}
