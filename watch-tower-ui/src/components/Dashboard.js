import { useEffect, useState } from "react";
import "./Dashboard.css";
import { config } from "./config";
import AppVizs from "./AppVizs";

function Dashboard() {
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
  return (
    <div className="dashboard-container">
      <div className="app-viz-container">
        {apps.map((app, idx) => {
          return (
            <AppVizs
              key={idx}
              vizs={vizs.filter((viz) => parseInt(viz.app) == app.id)}
              app={app}
            ></AppVizs>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
