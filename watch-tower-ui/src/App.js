import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { useState } from "react";
import { Route, useHistory } from "react-router-dom";
import CreateAnalytics from "./components/CreateAnalytics";
import AnalyticsViz from "./components/AnalyticsViz";
import Dashboard from "./components/Dashboard";
import { useEffect } from "react";
import { config } from "./components/config";
import jwt from "jwt-decode";

function App() {
  const [job, setJob] = useState({});
  const [jobs, setJobs] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("access") != "undefined" &&
      localStorage.getItem("access") != null &&
      jwt(JSON.parse(localStorage.getItem("access"))["access_token"]).exp *
        1000 >
        Date.now()
      ? true
      : false
  );

  console.log(localStorage.getItem("access"));

  useEffect(() => {
    setInterval(() => {
      renewToken();
    }, 500000);
  });

  function raiseAlert(type, message) {
    setAlert(true);
    setAlertContent(message);
    const timeId = setTimeout(() => {
      setAlert(false);
      setAlertContent("");
    }, 2000);
  }

  function renewToken() {
    console.log("Refreshing Token");
    let token = JSON.parse(localStorage.getItem("access"));
    if (token != null) {
      console.log(token.refresh_token);
      fetch(config.apiUrl + "token/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer " +
            JSON.parse(localStorage.getItem("access")).refresh_token,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((actualData) => {
          console.log(actualData);
          localStorage.setItem("access", JSON.stringify(actualData));
        });
    }
  }

  function loginHandler() {
    setLoggedIn(true);
  }

  function logoutHandler() {
    window.name = "";
    localStorage.clear();
    setLoggedIn(false);
  }

  return (
    <div>
      <div className={"notification" + (alert ? "" : " notification-hidden")}>
        <div className="notif-icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>
        <div className="not-msg">
          <div>{alertContent}</div>
        </div>
      </div>
      <Navbar isLoggedIn={loggedIn} onLogout={logoutHandler}></Navbar>
      {!loggedIn ? (
        <Login raiseAlert={raiseAlert} onLogin={loginHandler}></Login>
      ) : null}
      {loggedIn && (
        <div>
          <div>
            <Route
              exact
              path="/create-analytics"
              component={CreateAnalytics}
            ></Route>
          </div>
          <div>
            <Route exact path="/analytics-viz">
              <AnalyticsViz raiseAlert={raiseAlert}></AnalyticsViz>
            </Route>
          </div>
          <div>
            <Route exact path="/dashboard">
              <Dashboard raiseAlert={raiseAlert}></Dashboard>
            </Route>
          </div>
          <div>
            <Route exact path="/">
              <Dashboard raiseAlert={raiseAlert}></Dashboard>
            </Route>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
