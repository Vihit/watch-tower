import { useState } from "react";
import "./Navbar.css";
import { Link, useHistory } from "react-router-dom";
import { config } from "./config";

function Navbar(props) {
  const [accountClick, setAccountClick] = useState(false);

  function handleAccountClick() {
    setAccountClick(!accountClick);
  }

  function handleLogout() {
    setAccountClick(false);
    props.onLogout();
  }

  if (props.isLoggedIn) {
    return (
      <div className="navbar">
        <div className="logo">
          <div className="appname">WatchTower</div>
        </div>
        <div className="options">
          <div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <Link to="/create-analytics">Viz-Studio</Link>
          </div>
        </div>
        <div className="account" onClick={handleAccountClick}>
          <i className="fas fa-user-circle icon-account"></i>
        </div>
        <ul className={"dropdown " + (accountClick ? "show" : "")}>
          <li className="dropdown-item user">Vihit</li>
          <li className="dropdown-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <div className="navbar">
        <div className="logo">
          <img className="delogo"></img>
          <div className="appname">WatchTower</div>
        </div>
      </div>
    );
  }
}

export default Navbar;
