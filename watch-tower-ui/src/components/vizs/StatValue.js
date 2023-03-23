import { useEffect, useState } from "react";
import "./StatValue.css";
import { config } from "../config";

function StatValue(props) {
  const [data, setData] = useState("");
  useEffect(() => {
    console.log(props);
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
        let selectCols = query
          .split("from")[0]
          .split("  ")[1]
          .split(",")
          .map((col) => {
            var aliases = col.split(" as ");
            return aliases[aliases.length - 1];
          });
        let valueCols = selectCols[0];
        setData(actualData[0]["data"][valueCols]);
      });
  }

  return (
    <div
      className="stat-value"
      style={{ backgroundColor: props.conf.statBgColor }}
    >
      <div className="stat-title" style={{ color: props.conf.statColor }}>
        {props.title}
      </div>
      <div className="stat-val" style={{ color: props.conf.statColor }}>
        {data}
      </div>
    </div>
  );
}

export default StatValue;
