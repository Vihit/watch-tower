import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./AppVizs.css";
import { config } from "./config";

function AppVizs(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [appName, setAppName] = useState("");

  let history = useHistory();

  function goToAnalytics(viz) {
    history.push("/analytics-viz", viz);
  }

  function goToEdit(viz) {
    history.push("/create-analytics", viz);
  }

  function addApp() {
    var app = { name: appName, type: "internal" };
    fetch(config.apiUrl + "apps/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
      body: JSON.stringify(app),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((actualData) => {
        props.raiseAlert("green", "App Added!");
        props.appAdded(actualData);
        setIsOpen(false);
        setAppName("");
      });
  }

  return (
    <div className="app-lvl">
      {!props.addApp && (
        <div className="app-lvl-name" onClick={() => setIsOpen(!isOpen)}>
          <div className="app-css">
            <div>{props.app.name}</div>{" "}
            <div className="viz-count">{props.vizs.length}</div>
          </div>
          <div>
            {!isOpen && <i className="fa-solid fa-plus"></i>}
            {isOpen && <i className="fa-solid fa-minus"></i>}
          </div>
        </div>
      )}
      {!props.addApp && (
        <div className={"viz-lvl " + (!isOpen ? "close-flex" : "")}>
          {props.vizs.map((viz, idx) => {
            return (
              <div key={idx} className="viz-lvl-name">
                <div className="viz-n" onClick={() => goToAnalytics(viz)}>
                  {viz.name}
                </div>
                <div className="viz-i" onClick={() => goToEdit(viz)}>
                  <i className="fa-solid fa-edit"></i>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {props.addApp && (
        <div className="add-app-lvl-name" onClick={() => setIsOpen(!isOpen)}>
          <div className="add-app-css">
            <div className="add-app">Add an App</div>{" "}
          </div>
          <div>
            {!isOpen && <i className="fa-solid fa-plus"></i>}
            {isOpen && <i className="fa-solid fa-minus"></i>}
          </div>
        </div>
      )}
      {props.addApp && (
        <div className={"add-viz-lvl " + (!isOpen ? "close-flex" : "")}>
          <div className="add-app-inputs">
            <div className="add-app-input">
              <input
                type="text"
                placeholder="App Name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              ></input>
            </div>
            <div className="add-app-input">
              <select>
                <option value="internal">Internal</option>
              </select>
            </div>
            <div className="grow"></div>
            <div className="add-app-btn-div">
              <button className="add-app-btn" onClick={() => addApp()}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppVizs;
