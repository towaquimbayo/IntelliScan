import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSession } from "../redux/actions/UserAction";

export default function Navbar() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  return (
    <nav className="navbar">
      <div className="navContainer">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" className="logo">
            <span>IntelliScan</span>
          </Link>
        </div>
        <div className="navLinksContainer">
          {isAdmin && (
            <NavLink
              className="navLink"
              to="/admin"
              activeclassname="active"
            >
              Admin Dashboard
            </NavLink>
          )}
          {isLoggedIn ? (
            <Link
              className="navLink"
              onClick={async () => dispatch(clearSession())}
            >
              Logout
            </Link>
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
