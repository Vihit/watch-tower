import { React, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect } from "react";
import { config } from "./../config";

function BarChart(props) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });

  const backgroundColor = [
    "rgba(255, 99, 132)",
    "rgba(54, 162, 235)",
    "rgba(255, 206, 86)",
    "rgba(75, 192, 192)",
    "rgba(153, 102, 255)",
    "rgba(255, 159, 64)",
  ];
  useEffect(() => {
    pullData();
  }, []);

  function pullData() {
    fetch(config.apiUrl + "watchtower/query/" + props.conf.query, {
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
        const query = props.conf.query;
        let groupByCols = query.split("group by ")[1].split(",");
        let selectCols = query
          .split("from")[0]
          .split("  ")[1]
          .split(",")
          .map((col) => {
            var aliases = col.split(" as ");
            return aliases[aliases.length - 1];
          });
        let valueCols = selectCols.filter((col) => !groupByCols.includes(col));
        var labels = [];
        var finalData = [];
        var datasets = [];
        actualData.forEach((data) => {
          if (!labels.includes(data.data[groupByCols[0]]))
            labels.push(data.data[groupByCols[0]]);
        });
        valueCols.forEach((vl, idx) => {
          datasets.push({
            label: valueCols[idx],
            data: actualData.map((dt) => dt.data[valueCols[idx]]),
            backgroundColor: backgroundColor[idx],
            borderColor: backgroundColor[idx],
          });
        });

        groupByCols.forEach((col, idx) => {
          // datasets.push({
          //   label: valueCols[0],
          //   data: actualData.map((dt) => dt.data[valueCols[0]]),
          //   backgroundColor: backgroundColor[idx],
          //   borderColor: backgroundColor[idx],
          //   borderWidth: 1,
          // });
        });

        console.log(datasets);
        setChartData({
          labels: labels,
          datasets: datasets,
        });
      });
  }

  const data = [
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
  const [userData, setUserData] = useState({
    labels: [2015, 2016, 2017, 2018, 2019],
    datasets: [
      {
        label: "Users Gained",
        data: data.map((data) => data.userGain),
        backgroundColor: "rgb(0,0,255,0.4)",
        borderRadius: 10,
        borderColor: "blue",
        borderStyle: "solid",
      },
      {
        label: "Users Lost",
        data: data.map((data) => data.userLost),
        backgroundColor: "rgb(255,0,0,0.4)",
        borderRadius: 10,
        borderColor: "red",
        borderStyle: "solid",
      },
    ],
  });
  return (
    <Bar
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: props.title } },
      }}
    >
      Chart
    </Bar>
  );
}

export default BarChart;
