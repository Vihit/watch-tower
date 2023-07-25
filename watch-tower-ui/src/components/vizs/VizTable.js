import "./VizTable.css";
import { config } from "../config";
import { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import { Typography } from "@mui/material/";

function VizTable(props) {
  const [chartData, setChartData] = useState({ rows: [], header: [] });
  var matCols = [];
  console.log(props);
  useEffect(() => {
    pullData();
  }, []);

  function pullData() {
    let url = encodeURI(config.apiUrl + "watchtower/query/" + props.conf.query);
    fetch(url, {
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
        let rows = [];
        let cols = [];
        let selectCols = query
          .split("from")[0]
          .split("  ")[1]
          .split(",")
          .map((col) => {
            var aliases = col.split(" as ");
            return aliases[aliases.length - 1];
          });

        selectCols.forEach((col) => {
          cols.push({
            field: col,
            headerName: col,
            width: 1200,
            headerClassName: "super-app-theme--header",
          });
          matCols.push({ accessorKey: col, header: col });
        });
        actualData.forEach((data, idx) => {
          let obj = {};
          if (!selectCols.includes("id")) {
            obj["id"] = idx;
          }
          selectCols.forEach((col) => {
            obj[col] = data.data[col];
          });
          rows.push(obj);
        });

        setChartData({
          header: matCols,
          rows: rows,
        });
      });
  }

  return (
    <div className="tbl-viz">
      <MaterialReactTable
        columns={chartData.header}
        data={chartData.rows}
        enableStickyHeader
        enableStickyFooter
        enableTopToolbar={true}
        renderTopToolbarCustomActions={({ table }) => (
          <Typography
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: "Poppins",
              fontWeight: "bold",
              color: "#666",
              background: "var(--grey)",
              padding: "2px 5px",
            }}
          >
            {props.title}
          </Typography>
        )}
        muiTableContainerProps={{
          sx: { maxHeight: "550px", maxWidth: "100%", overflowX: "auto" },
        }}
        initialState={{ density: "compact" }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: "bold",
            fontSize: "14px",
            backgroundColor: "var(--white)",
            color: "var(--dark)",
            border: "1px solid",
          },
        }}
        muiTableBodyCellProps={{
          sx: { backgroundColor: "var(--light)", border: "0.1px solid white" },
        }}
      ></MaterialReactTable>
    </div>
  );
}

export default VizTable;
