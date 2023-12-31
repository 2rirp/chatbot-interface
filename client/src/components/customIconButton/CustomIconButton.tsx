import { ReactNode } from "react";
import PropTypes from "prop-types";
import "./customIconButton.css";

interface CustomIconButtonProps {
  children: ReactNode;
  ariaLabel?: string;
  onClick?: (event?: any) => void;
  className?: string;
  deactivateTransparency?: boolean;
  badgeContent?: ReactNode;
  badgeColor?: string;
  badgeContentColor?: string;
  disabled?: boolean;
}

function CustomIconButton(props: CustomIconButtonProps) {
  return (
    <button
      className={`icon-button ${props.className || ""} ${
        !props.deactivateTransparency ? "icon-button-transparency" : ""
      } ${props.disabled ? "disabled" : ""}`}
      aria-label={props.ariaLabel || ""}
      onClick={props.onClick}
      type="button"
      disabled={props.disabled || false}
    >
      {props.children}
      {props.badgeContent !== undefined && (
        <span
          className="icon-button-badge"
          style={{
            backgroundColor: props.badgeColor || "var(--tertiary-blue)",
            color: props.badgeContentColor || "var(--tertiary-text-color)",
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
  disabled: PropTypes.bool,
};

export default CustomIconButton;
