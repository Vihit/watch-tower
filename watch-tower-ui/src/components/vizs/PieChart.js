import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";
import { config } from "./../config";

function PieChart(props) {
  const [queryData, setQueryData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  var backgroundColor = [
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
        setQueryData(actualData);
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
        actualData.forEach((data) => {
          labels.push(
            groupByCols
              .map((col) => data.data[col])
              .reduce((a, b) => a + "-" + b)
          );
          finalData.push(data.data[valueCols[0]]);
        });
        setChartData({
          labels: labels,
          datasets: [
            {
              label: "ABC",
              data: finalData,
              backgroundColor: [
                "rgba(255, 99, 132)",
                "rgba(54, 162, 235)",
                "rgba(255, 206, 86)",
                "rgba(75, 192, 192)",
                "rgba(153, 102, 255)",
                "rgba(255, 159, 64)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });
      });
  }
  return (
    <Pie
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: { title: { display: true, text: props.title } },
      }}
    ></Pie>
  );
}

export default PieChart;
