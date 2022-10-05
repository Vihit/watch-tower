import { React, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart(props) {
  const [userData, setUserData] = useState({
    labels: [2015, 2016, 2017, 2018, 2019],
    datasets: [
      {
        label: "Users Gained",
        data: props.data.map((data) => data.userGain),
        backgroundColor: "rgb(255,0,0,0.4)",
        borderRadius: 10,
        borderColor: "red",
        borderStyle: "solid",
      },
    ],
  });
  return <Bar data={userData}>Chart</Bar>;
}

export default BarChart;
