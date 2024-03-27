import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "../redux/actions/UserAction";

export default function Navbar() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="logo">
            <span>IntelliScan</span>
          </Link>
        </div>
        <div className="navLinksContainer">
          {isLoggedIn ? (
            <>
              <NavLink
                className="navLink"
                to="/admin-dashboard"
                activeclassname="active"
              >
                Admin Dashboard
              </NavLink>
              <NavLink
                className="navLink"
                onClick={async () => {
                  await fetch("/api/logout");
                  dispatch(clearSession());
                }}
                activeclassname="active"
              >
                Logout
              </NavLink>
            </>
          ) : (
            <NavLink className="navLink" to="/login" activeclassname="active">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
