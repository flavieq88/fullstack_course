import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../reducers/userReducer";
import { notify } from "../reducers/notifReducer";

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(clearUser());
    dispatch(notify({ message: "Successfully signed out", color: "green" }, 2));
  };

  return (
    <div className="navbar">
      <li className="logo">
        <strong>BlogCatalog</strong>
      </li>
      <li>
        <NavLink to="/" className=".navblock">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/blogs" className=".navblock">
          Blogs
        </NavLink>
      </li>
      <li>
        <NavLink to="/users" className=".navblock">
          Users
        </NavLink>
      </li>

      <div style={{ float: "right" }}>
        <li className="navblock">{`${user.name} is signed in `}</li>
        <li>
          <button onClick={handleLogout} className="navbutton">
            Log out
          </button>
        </li>
      </div>
    </div>
  );
};

export default NavBar;
