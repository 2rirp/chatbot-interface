import { ReactNode } from "react";
import PropTypes from "prop-types";
import "./customIconButton.css";

interface CustomIconButtonProps {
  children: ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
  deactivateTransparency?: boolean;
  badgeContent?: ReactNode;
  badgeColor?: string;
  badgeContentColor?: string;
}

function CustomIconButton(props: CustomIconButtonProps) {
  return (
    <button
      className={`icon-button ${props.className || ""} ${
        !props.deactivateTransparency ? "icon-button-transparency" : ""
      }`}
      aria-label={props.ariaLabel || ""}
      onClick={props.onClick}
      type="button"
    >
      {props.children}
      {props.badgeContent !== undefined && (
        <span
          className="icon-button-badge"
          style={{
            backgroundColor: props.badgeColor || "#6a94cf",
            color: props.badgeContentColor || "rgba(0, 0, 0, 0.54)",
          }}
        >
          {props.badgeContent || null}
        </span>
      )}
    </button>
  );
}

CustomIconButton.propTypes = {
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  deactivateTransparency: PropTypes.bool,
  badgeContent: PropTypes.node,
  badgeColor: PropTypes.string,
  badgeContentColor: PropTypes.string,
};

export default CustomIconButton;
