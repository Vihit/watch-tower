import { useEffect, useState } from "react";
import "./Dashboard.css";
import { config } from "./config";
import AppVizs from "./AppVizs";

function Dashboard(props) {
  const [vizs, setVizs] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getApps();
    getVizs();
  }, []);

  function getApps() {
    fetch(config.apiUrl + "apps/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((actualData) => {
        setApps(actualData);
      });
  }

  function getVizs() {
    fetch(config.apiUrl + "watchtower/viz", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((actualData) => {
        setVizs(actualData);
      });
  }

  function appAdded(app) {
    setApps((prev) => {
      let prevApps = [...apps];
      prevApps.push(app);
      return prevApps;
    });
  }

  return (
    <div className="dashboard-container">
      <div className="app-viz-container">
        {apps.map((app, idx) => {
          return (
            <AppVizs
              raiseAlert={props.raiseAlert}
              key={idx}
              vizs={vizs.filter((viz) => parseInt(viz.app) == app.id)}
              app={app}
            ></AppVizs>
          );
        })}
        <AppVizs
          raiseAlert={props.raiseAlert}
          addApp={true}
          appAdded={appAdded}
        ></AppVizs>
      </div>
    </div>
  );
}

export default Dashboard;
