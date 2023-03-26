import "./VizTable.css";
import { config } from "../config";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

function VizTable(props) {
  const [chartData, setChartData] = useState({ rows: [], header: [] });

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
            width: 90,
            headerClassName: "super-app-theme--header",
          });
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
          header: cols,
          rows: rows,
        });
      });
  }

  return (
    <div className="tbl-viz">
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          rows={chartData.rows}
          columns={chartData.header}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[100]}
          density="compact"
          showCellVerticalBorder
          showColumnVerticalBorder
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
        />
      </Box>
    </div>
  );
}

export default VizTable;
