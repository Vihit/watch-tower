import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import { Route, useHistory } from "react-router-dom";

function App() {
  const [job, setJob] = useState({});
  const [jobs, setJobs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

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
          <Route exact path="/" component={Dashboard}></Route>
        </div>
      )}
    </div>
  );
}

export default App;
