import "./modal.css";

interface ModalProps {
  onClose: () => void;
}

export default function Modal(props: ModalProps) {
  function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
  }

  return (
    <div className="modalBackground" onClick={props.onClose}>
      <div className="modalContent" onClick={stopPropagation}>
        <p>Credenciais Incorretas.</p>
      </div>
    </div>
  );
}
