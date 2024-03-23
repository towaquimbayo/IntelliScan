import { useEffect } from "react";
import { BiCheckCircle, BiErrorCircle, BiInfoCircle } from "react-icons/bi";
import "../css/global.css";

export default function AlertMessage({ msg, type, iconSize = 24}) {
  useEffect(() => {
    if (msg) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [msg]);

  return (
    <div className={`alertMessageContainer ${type}`}>
      {type === "error" && <BiErrorCircle size={iconSize} color="#FF0033" />}
      {type === "success" && <BiCheckCircle size={iconSize} color="#00CC66" />}
      {type === "info" && <BiInfoCircle size={iconSize} color="#0066FF" />}
      <p>{msg}</p>
    </div>
  );
}
