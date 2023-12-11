import "./collapsibleComponent.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useRef, useState } from "react";

interface CollapsibleComponentProps {
  title: string;
  level: 1 | 2;
  children: React.ReactNode;
  childrenHeight: number | null;
}

export default function CollapsibleComponent(props: CollapsibleComponentProps) {
  const [open, setOpen] = useState(true);
  /*  const [contentHeight, setContentHeight] = useState<number | null>(null); */
  const contentRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log(
      `I heard the height was updated for children of ${props.title}, ${contentRef.current?.scrollHeight}, ${contentRef.current?.clientHeight}, ${props.childrenHeight}`
    );
    if (contentRef.current) {
      /* setContentHeight(contentRef.current.scrollHeight); */
      console.log("Got here");
    }
  }, [props.childrenHeight]);

  return (
    <div className="collapsible-component">
      <div
        className={`collapsible-title level-${props.level}`}
        onClick={toggle}
      >
        {props.title}
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </div>
      <div
        className="collapsible-content-parent"
        ref={contentRef}
        style={
          open
            ? {
                height:
                  "auto" /* props.level !== 1 ? "auto" : contentHeight + "px" */,
              }
            : { height: "0px" }
        }
      >
        {props.children}
      </div>
    </div>
  );
}
