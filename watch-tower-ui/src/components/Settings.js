import "./Settings.css";
import { config } from "./config";
import { useEffect, useState } from "react";

function Settings(props) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))["user"]
  );
  const [connectionString, setConnectionString] = useState("");
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [driver, setDriver] = useState("");

  useEffect(() => {}, []);

  return (
    <div className="settings-container">
      <div className="set-close" onClick={() => props.closeSettings(false)}>
        <i className="fa-solid fa-close"></i>
      </div>
      <div className="set-head">Settings</div>
      <div className="grow-20"></div>
      <div className="set-ctrl">
        <div className="set-label">Connection String</div>
        <div className="set-text">
          <input
            type="text"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="set-ctrl">
        <div className="set-label">Username</div>
        <div className="set-text">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="set-ctrl">
        <div className="set-label">Connection String</div>
        <div className="set-text">
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="set-ctrl">
        <div className="set-label">Driver</div>
        <div className="set-text">
          <select
            type="text"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
          >
            <option value="">select</option>
            <option value="com.mysql.cj.jdbc.Driver">mysql</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;
