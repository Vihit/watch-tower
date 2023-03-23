import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import AnalyticsVizPreview from "./AnalyticsVizPreview";
import "./CreateAnalytics.css";
import CreationCell from "./CreationCell";
import VizConfig from "./VizConfig";
import VizOption from "./VizOption";
import { config } from "./config";

function CreateAnalytics() {
  const [layout, setLayout] = useState([]);
  const [confVisible, setConfVisible] = useState(false);
  const [conf, setConf] = useState([]);
  const [currCell, setCurrCell] = useState({ row: -1, col: -1 });
  const [toggleLayout, setToggleLayout] = useState(false);
  const [toggleViz, setToggleViz] = useState(false);
  let emptyConf = {
    name: "",
    type: "",
    advanced: false,
    query: "",
  };
  const [showPreview, setShowPreview] = useState(false);
  const [filter, setFilter] = useState("");
  const [vizName, setVizName] = useState("");
  const [apps, setApps] = useState([]);
  const [app, setApp] = useState("");
  const [forms, setForms] = useState([]);
  const location = useLocation();
  const [id, setId] = useState(null);

  useEffect(() => {
    if (location.state != null) {
      const template = JSON.parse(location.state.template);
      setLayout((prev) => {
        return template.layout;
      });
      setVizName(location.state.name);
      setConf((prev) => {
        return template.vizs;
      });
      setApp(location.state.app);
      setId(location.state.id);
    }
    getApps();
    getForms();
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

  function showConf(row, col) {
    if ((currCell.row !== row || currCell.col !== col) && !confVisible) {
      setCurrCell({ row: row, col: col });
      setConfVisible(!confVisible);
    } else if (currCell.row === row && currCell.col === col) {
      if (confVisible) {
        setConfVisible(!confVisible);
        setCurrCell({ row: -1, col: -1 });
      } else setCurrCell({ row: -1, col: -1 });
    } else if (confVisible) {
      setCurrCell({ row: row, col: col });
    }
  }

  function addCell(row) {
    setLayout((prev) => {
      let currLayout = [...prev];
      let rowToBeUpdated = prev[row];
      rowToBeUpdated.push(0);
      currLayout.splice(row, rowToBeUpdated);
      console.log(currLayout);
      return currLayout;
    });
    setConf((prev) => {
      let currConf = [...conf];
      let confToBeUpdated = prev[row];
      confToBeUpdated.push(emptyConf);
      currConf.splice(row, confToBeUpdated);
      return currConf;
    });
  }

  function removeCell(row) {
    setLayout((prev) => {
      let currLayout = [...prev];
      let rowToBeUpdated = prev[row];
      rowToBeUpdated.pop();
      if (rowToBeUpdated.length === 0) currLayout.splice(row, 1);
      else currLayout.splice(row, rowToBeUpdated);
      console.log(currLayout);
      return currLayout;
    });
    setConf((prev) => {
      let currConf = [...conf];
      let confToBeUpdated = prev[row];
      confToBeUpdated.pop();
      if (confToBeUpdated.length === 0) currConf.splice(row, 1);
      else currConf.splice(row, confToBeUpdated);
      return currConf;
    });
  }

  function addRow() {
    setLayout((prev) => {
      let currLayout = [...prev];
      currLayout.push([0]);
      return currLayout;
    });
    setConf((prev) => {
      let currConf = [...prev];
      currConf.push([emptyConf]);
      return currConf;
    });
  }

  function toggle(what) {
    if (what === "viz") {
      setToggleViz(!toggleViz);
    } else if (what === "layout") {
      setToggleLayout(!toggleLayout);
    }
  }

  function saveConfFor(cell, updatedConf) {
    setConf((prev) => {
      let currConf = [...prev];
      let confToBeUpdated = prev[cell.row];
      confToBeUpdated.splice(parseInt(cell.col), 1, updatedConf);
      return currConf;
    });
    setConfVisible(false);
    setCurrCell({ row: -1, col: -1 });
    console.log(conf);
  }

  function vizChosen(viz, row, col) {
    setConf((prev) => {
      let currConf = [...prev];
      let confToBeUpdated = prev[row];
      let updatedConf = confToBeUpdated[col];
      if (updatedConf["type"] !== viz) {
        updatedConf = emptyConf;
      }
      updatedConf["type"] = viz;
      if (viz === "fa-font") {
        updatedConf["statColor"] = "#ffffff";
        updatedConf["statBgColor"] = "#000000";
      }
      confToBeUpdated.splice(parseInt(col), 1, updatedConf);
      return currConf;
    });
  }
  function getForms() {
    fetch(config.apiUrl + "watchtower/tables", {
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
        setForms(actualData);
      });
  }

  function saveAnalytics(state) {
    var fullConf = { vizs: conf, layout: layout };
    var viz = {
      id: id,
      name: vizName,
      app: app,
      template: JSON.stringify(fullConf),
      state: state,
      version: 1,
    };
    console.log(viz);
    fetch(config.apiUrl + "watchtower/viz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("access")).access_token,
      },
      body: JSON.stringify(viz),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((actualData) => {
        console.log("Viz Saved");
      });
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="create-container">
        <div className="components-container">
          <div className="app-name-container">
            <select value={app} onChange={(e) => setApp(e.target.value)}>
              <option value={""}>Select an App</option>
              {apps.map((app, idx) => {
                return (
                  <option key={idx} value={app.id}>
                    {app.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="layout-container">
            <div className="layout">
              <div
                className="component-header"
                onClick={() => toggle("layout")}
              >
                <div>Layout</div>
                {toggleLayout && (
                  <div>
                    <i className="fa-solid fa-minus"></i>
                  </div>
                )}
                {!toggleLayout && (
                  <div>
                    <i className="fa-solid fa-plus"></i>
                  </div>
                )}
              </div>
              {toggleLayout &&
                layout.map((rows, idx) => {
                  return (
                    <div className="layout-row" key={idx}>
                      <i
                        className="fa-solid fa-minus layout-add"
                        onClick={() => removeCell(idx)}
                      ></i>
                      {rows.map((r, inx) => {
                        return (
                          <i
                            key={inx}
                            className="fa-solid fa-square layout-cell"
                          ></i>
                        );
                      })}
                      <i
                        className="fa-solid fa-plus layout-add"
                        onClick={() => addCell(idx)}
                      ></i>
                    </div>
                  );
                })}
              {toggleLayout && (
                <div className="add-row" onClick={addRow}>
                  <i className="fa-solid fa-plus"></i>
                </div>
              )}
            </div>
          </div>
          <div className="viz-container">
            <div className="component-header" onClick={() => toggle("viz")}>
              <div>Viz Options</div>
              {toggleViz && (
                <div>
                  <i className="fa-solid fa-minus"></i>
                </div>
              )}
              {!toggleViz && (
                <div>
                  <i className="fa-solid fa-plus"></i>
                </div>
              )}
            </div>
            {toggleViz && (
              <div className="viz-options">
                <div className="viz-option-container">
                  <VizOption type="fa-chart-line"></VizOption>
                  <VizOption type="fa-chart-simple"></VizOption>
                  <VizOption type="fa-chart-pie"></VizOption>
                  <VizOption type="fa-chart-area"></VizOption>
                  <VizOption type="fa-font"></VizOption>
                </div>
              </div>
            )}
          </div>
          <div className="preview">
            <button
              className="preview-btn"
              onClick={() => {
                setShowPreview(!showPreview);
                setConfVisible(false);
                setCurrCell({ row: -1, col: -1 });
              }}
            >
              Preview
            </button>
            <button className="save-btn" onClick={() => saveAnalytics("Draft")}>
              Save
            </button>
            <button
              className="publish-btn"
              onClick={() => saveAnalytics("Published")}
            >
              Publish
            </button>
          </div>
        </div>
        <div className="creation-container">
          <div className="viz-details">
            <div className="viz-name">
              <input
                type="text"
                placeholder="Viz Name*"
                value={vizName}
                onChange={(e) => setVizName(e.target.value)}
              ></input>
            </div>
            {/* <div className="viz-filter">
              <input
                type="text"
                placeholder="Filter Column"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              ></input>
            </div> */}
          </div>
          {layout.map((rows, idx) => {
            return (
              <div
                key={idx}
                className="creation-row"
                style={{ height: "calc(100%/" + layout.length + ")" }}
              >
                {rows.map((row, inx) => {
                  return (
                    <CreationCell
                      rowId={idx}
                      colId={inx}
                      totalCells={rows.length}
                      showConf={showConf}
                      conf={conf[idx][inx]}
                      key={"1" + idx + "" + inx}
                      clicked={idx === currCell.row && inx === currCell.col}
                      vizChosen={vizChosen}
                    ></CreationCell>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {conf.length > 0 && confVisible && app !== "" && (
        <VizConfig
          confVisible={confVisible}
          currCell={currCell}
          conf={conf[currCell.row][currCell.col]}
          key={currCell.row + "" + currCell.col}
          saveConf={saveConfFor}
          app={apps.filter((a) => a.id == app)[0]}
          forms={forms
            .filter((f) => true)
            .map((f) => {
              return {
                id: f.data.tbl,
                name: f.data.tbl,
                columns: f.data.columns,
              };
            })}
        ></VizConfig>
      )}
      {showPreview && (
        <AnalyticsVizPreview
          conf={conf}
          layout={layout}
          filter={filter}
          vizName={vizName}
          closePreview={setShowPreview}
        />
      )}
    </DndProvider>
  );
}

export default CreateAnalytics;
