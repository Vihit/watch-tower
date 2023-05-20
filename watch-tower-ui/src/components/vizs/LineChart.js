import { config } from "./../config";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

function LineChart(props) {
  const data = {
    labels: ["1", "2", "3"],
    datasets: [
      {
        label: "Dataset 1",
        data: ["0.1", "0.2", "0.3"],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

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
        let groupByCols = query
          .split("group by ")[1]
          .split(" order by ")[0]
          .split(",");
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

  return (
    <Line
      options={{
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: props.title } },
      }}
      data={chartData}
    />
  );
}

export default LineChart;
