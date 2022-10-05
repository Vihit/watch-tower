import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import BarChart from "./BarChart";
import "./Dashboard.css";

function Dashboard() {
  const userData = [
    {
      id: 1,
      year: 2015,
      userGain: 1000,
      userLost: 2,
    },
    {
      id: 2,
      year: 2016,
      userGain: 112300,
      userLost: 20,
    },
    {
      id: 3,
      year: 2017,
      userGain: 111000,
      userLost: 22123,
    },
    {
      id: 4,
      year: 2018,
      userGain: 121000,
      userLost: 57800,
    },
    {
      id: 5,
      year: 2019,
      userGain: 10200,
      userLost: 3320,
    },
  ];
  return (
    <div className="dashboard-container">
      <div className="title-handles">
        <div className="heading">Sample Analytics</div>
      </div>
      <div className="chart-container">
        <div className="chart">
          <BarChart data={userData}></BarChart>
        </div>{" "}
        <div className="chart">
          <BarChart data={userData}></BarChart>
        </div>{" "}
        <div className="chart">
          <BarChart data={userData}></BarChart>
        </div>{" "}
        <div className="chart">
          <BarChart data={userData}></BarChart>
        </div>{" "}
        <div className="chart">
          <BarChart data={userData}></BarChart>
        </div>{" "}
        <div className="chart">
          <BarChart data={userData}></BarChart>
        </div>{" "}
      </div>
    </div>
  );
}

export default Dashboard;
