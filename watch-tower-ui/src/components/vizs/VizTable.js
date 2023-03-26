import "./VizTable.css";
import { config } from "../config";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import MaterialReactTable from "material-react-table";

function VizTable(props) {
  const [chartData, setChartData] = useState({ rows: [], header: [] });
  var matCols = [];

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
      {/* <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          // autoHeight
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
      </Box> */}
      <MaterialReactTable
        columns={chartData.header}
        data={chartData.rows}
        enableStickyHeader
        enableStickyFooter
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
