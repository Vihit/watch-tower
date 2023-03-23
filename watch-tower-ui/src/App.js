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

function App() {
  const [job, setJob] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("access") != null ? true : false
  );

  useEffect(() => {
    setInterval(() => {
      renewToken();
    }, 500000);
  });
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
    localStorage.clear();
    setLoggedIn(false);
  }

  return (
    <div>
      <Navbar isLoggedIn={loggedIn} onLogout={logoutHandler}></Navbar>
      {!loggedIn ? <Login onLogin={loginHandler}></Login> : null}
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
            <Route exact path="/analytics-viz" component={AnalyticsViz}></Route>
          </div>
          <div>
            <Route exact path="/dashboard" component={Dashboard}></Route>
          </div>
          <div>
            <Route exact path="/" component={Dashboard}></Route>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
