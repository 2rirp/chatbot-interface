import "./unreadIndicator.css";

interface UnreadIndicatorProps {
  counter?: number;
}

export default function UnreadIndicator(props: UnreadIndicatorProps) {
  return (
    <div
      className={`unread-indicator${
        props.counter && props.counter > 0 ? " unread" : ""
      }`}
    >
      {props.counter && props.counter > 0 ? props.counter : null}
    </div>
  );
}
