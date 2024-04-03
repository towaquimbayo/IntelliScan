import { FaSpinner } from "react-icons/fa";

export default function Button({
  type = "button",
  title,
  onClick = () => {},
  loading,
  text,
  children,
  full = false,
  disabled = false,
  customStyle,
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick(e);
      }}
      className={
        `btnPrimary` + (full ? " full" : "") + (disabled ? " disabled" : "")
      }
      style={{ ...customStyle }}
    >
      {loading ? (
        <>
          <FaSpinner size="16" className="buttonSpinner" />
          <span style={{ paddingLeft: "0.5rem" }}>Loading...</span>
        </>
      ) : (
        text || children
      )}
    </button>
  );
}
