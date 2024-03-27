import { FaSpinner } from "react-icons/fa";

export default function Button({
  type = "button",
  title,
  onClick,
  loading,
  full = false,
  text,
  children,
  customStyle,
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      className={`btnPrimary` + (full ? " full" : "")}
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
