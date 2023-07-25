import { useEffect, useState } from "react";
import "./VizConfig.css";
import { config } from "./config";
import ColSelectionWindow from "./ColSelectionWindow";

function VizConfig(props) {
  const [toggleBasicDetails, setToggleBasicDetails] = useState(false);
  const [toggleVizDetails, setToggleVizDetails] = useState(false);
  const [toggleDataDetails, setToggleDataDetails] = useState(false);
  const [toggleAdvanced, setToggleAdvanced] = useState(false);
  const [conf, setConf] = useState(props.conf);
  const [columns, setColumns] = useState([]);
  const [form, setForm] = useState();
  const [showGroupAdd, setShowGroupAdd] = useState(false);
  const [selectedGroupCols, setSelectedGroupCols] = useState([]);
  const [showFiltersAdd, setShowFiltersAdd] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    ops: [],
    filter: [],
  });
  const [showMeasuresAdd, setShowMeasuresAdd] = useState(false);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const emptyFilter = { cols: [""], conds: [""], ops: [""], logicalOps: [] };

  useEffect(() => {
    console.log(props);
    if (!props.conf.advanced) {
      var query = props.conf.query;
      if (query.split(" FROM ").length > 1) parseQuery(query);
    }
  }, []);

  function parseQuery(query) {
    let tblName =
      query.split(" FROM ").length > 1
        ? query.split(" FROM ")[1].split(" ")[0]
        : "";
    let tableName = tblName.includes("f_mstr")
      ? tblName.split("f_mstr")[1].split("_lgs")[0]
      : tblName.split("f_")[1].split("_lgs")[0];
    setForm(
      props.forms.filter(
        (f) => f.name.toLowerCase().replaceAll(" ", "_") === tableName
      )[0].id
    );
    formSelected(
      props.forms.filter(
        (f) => f.name.toLowerCase().replaceAll(" ", "_") === tableName
      )[0].id
    );

    let groupedCols =
      props.conf.query.split(" group by ").length > 1
        ? props.conf.query.split(" group by ")[1].split(",")
        : [];
    setSelectedGroupCols((prev) => {
      return props.conf.query.split(" group by ").length > 1
        ? props.conf.query.split(" group by ")[1].split(",")
        : [];
    });
    setSelectedMeasures((prev) => {
      console.log(props.conf.query);
      return props.conf.query.split("  FROM ")[0].length > 0
        ? props.conf.query
            .split("  FROM ")[0]
            .split("  ")[1]
            .split(",")
            .filter((x) => !groupedCols.includes(x))
            .map((sM) => {
              return {
                col: sM.split("(")[1].split(")")[0],
                measure: sM.split("(")[0],
              };
            })
        : [];
    });
    const conditions =
      query.split("WHERE 1=1 AND ").length > 1
        ? query.split("WHERE 1=1 AND ")[1].split(" group by")[0]
        : "";
    var lOps = [];
    var filters = [];
    if (conditions !== "") {
      conditions.split(" AND ").forEach((cond, idx) => {
        let cols = [];
        let conds = [];
        let ops = [];
        var logicalOps = [];
        cond
          .slice(1, -1)
          .split(" ")
          .forEach((cnd, inx) => {
            if (inx % 2 == 1) logicalOps.push(cnd);
            else {
              let col = cnd.split(new RegExp(config.filterOps.join("|")))[0];
              let cond = cnd
                .split(new RegExp(config.filterOps.join("|")))[1]
                .slice(1, -1);
              cols.push(col);
              conds.push(cond);
              ops.push(cnd.split(col)[1].split("'" + cond + "'")[0]);
            }
          });
        filters.push({
          cols: cols,
          conds: conds,
          ops: ops,
          logicalOps: logicalOps,
        });
      });
      setSelectedFilters((prev) => {
        return {
          ops: [],
          filter: filters,
        };
      });
    }
  }

  function toggle(what) {
    if (what === "basic-details") setToggleBasicDetails(!toggleBasicDetails);
    else if (what === "viz-details") setToggleVizDetails(!toggleVizDetails);
    else if (what === "data-details") setToggleDataDetails(!toggleDataDetails);
    else if (what === "advanced") setToggleAdvanced(!toggleAdvanced);
  }

  function parseTable(form) {
    if (props.app.type !== "external")
      return "f_" + form.toLowerCase().replace(/ /g, "_") + "_lgs";
  }

  function makeQuery() {
    var selectStmt = "";
    if (selectedMeasures.length > 0 && form !== "") {
      var filterConds = "1=1";
      selectedFilters.filter.forEach((filter, idx) => {
        filter.cols.forEach((col, inx) => {
          if (inx > 0) {
            filterConds =
              filterConds +
              " " +
              filter.logicalOps[inx - 1] +
              " " +
              col +
              filter.ops[inx] +
              "'" +
              filter.conds[inx] +
              "'";
          } else {
            filterConds =
              filterConds +
              " AND (" +
              col +
              filter.ops[inx] +
              "'" +
              filter.conds[inx] +
              "'";
          }
          if (inx == filter.cols.length - 1) {
            filterConds = filterConds + ")";
          }
        });
      });
      var tableName =
        props.forms.filter((f) => f.id == form)[0].type === "master"
          ? "f_mstr_" +
            props.forms
              .filter((f) => f.id == form)[0]
              .name.toLowerCase()
              .replaceAll(" ", "_") +
            "_lgs"
          : "f_" +
            props.forms
              .filter((f) => f.id == form)[0]
              .name.toLowerCase()
              .replaceAll(" ", "_") +
            "_lgs";
      selectStmt =
        "SELECT  " +
        (selectedGroupCols.length > 0
          ? selectedGroupCols.reduce((a, b) => a + "," + b) + ","
          : "") +
        (selectedMeasures.length > 0
          ? selectedMeasures
              .map((m) => m.measure + "(" + m.col + ")")
              .reduce((a, b) => a + "," + b)
          : "") +
        "  FROM " +
        tableName +
        " WHERE " +
        filterConds +
        (selectedGroupCols.length > 0
          ? " group by " + selectedGroupCols.reduce((a, b) => a + "," + b)
          : "");
    }
    console.log(selectStmt);
    return selectStmt;
  }

  function confChanged(what, value) {
    let currConf = { ...conf };
    var obj = currConf;
    if (what === "final" && !obj["advanced"]) {
      obj["query"] = makeQuery();
    } else if (what === "advanced.query") {
      obj["advanced"] = true;
      obj["query"] = value;
      if (value === "") obj["advanced"] = false;
      console.log(obj);
    } else if (what === "final") {
      //
    } else {
      let splitWhat = what.split(".");
      for (var i = 0; i < splitWhat.length - 1; i++) {
        let prop = splitWhat[i];
        obj = obj[prop];
      }
      let finalProp = splitWhat[i];
      obj[finalProp] = value;
    }
    setConf((prev) => {
      let currConf = { ...conf };
      var obj = currConf;
      if (what === "final" && !obj["advanced"]) {
        obj["query"] = makeQuery();
      } else if (what === "advanced.query") {
        obj["advanced"] = true;
        obj["query"] = value;
        if (value === "") obj["advanced"] = false;
      } else if (what === "final") {
        //
      } else {
        let splitWhat = what.split(".");
        for (var i = 0; i < splitWhat.length - 1; i++) {
          let prop = splitWhat[i];
          obj = obj[prop];
        }
        let finalProp = splitWhat[i];
        obj[finalProp] = value;
      }
      return currConf;
    });
    if (what === "final") {
      props.saveConf(props.currCell, currConf);
    }
  }

  function formSelected(id) {
    let form = props.forms.filter((f) => f.id == id)[0];
    if (props.app.type !== "external") {
      setColumns((prev) => {
        return form.columns.split(",");
      });
    }
  }

  function setMeasures(cols) {
    setSelectedMeasures((prev) => {
      let updatedMeasures = [];
      cols.forEach((col) => {
        if (prev.filter((p) => p.col === col).length == 0) {
          updatedMeasures.push({ col: col, measure: "" });
        } else {
          updatedMeasures.push(prev.filter((p) => p.col === col)[0]);
        }
      });
      return updatedMeasures;
    });
  }

  function updateMeasure(at, what) {
    setSelectedMeasures((prev) => {
      let updatedMeasures = [...prev];
      let updatedMeasure = updatedMeasures[at];
      updatedMeasure.measure = what;
      updatedMeasures.splice(at, 1, updatedMeasure);
      return updatedMeasures;
    });
  }

  function addAFilter() {
    setSelectedFilters((prev) => {
      let updatedFilters = { ...prev };
      let updatedFilter = updatedFilters.filter;
      updatedFilter.push(emptyFilter);
      return updatedFilters;
    });
  }

  function updateFilter(whichFilter, whichIndex, what, value) {
    setSelectedFilters((prev) => {
      let updatedFilters = { ...prev };
      let updatedFilter = updatedFilters.filter[whichFilter];
      if (what === "columns") updatedFilter.cols.splice(whichIndex, 1, value);
      if (what === "conditions")
        updatedFilter.conds.splice(whichIndex, 1, value);
      if (what === "ops") updatedFilter.ops.splice(whichIndex, 1, value);
      if (what === "logicalOps")
        updatedFilter.logicalOps.splice(whichIndex, 1, value);
      return updatedFilters;
    });
  }

  function addFilterTo(index) {
    setSelectedFilters((prev) => {
      let updatedFilters = { ...prev };
      let updatedFilter = updatedFilters.filter[index];
      updatedFilter.cols.push("");
      updatedFilter.ops.push("");
      updatedFilter.conds.push("");
      updatedFilter.logicalOps.push("and");
      return updatedFilters;
    });
  }

  return (
    <div
      className={
        "cell-configure-window " +
        (props.confVisible ? "slide-out-move" : "slide-in-move")
      }
    >
      <div className="viz-conf-header">
        <div>Configuration</div>
        <div
          style={{ cursor: "pointer" }}
          onClick={(e) => confChanged("final", "")}
        >
          <i className="fa-solid fa-floppy-disk"></i>
        </div>
      </div>
      <div className="config-form">
        <div className="dtl">
          <div className="dtl-head" onClick={() => toggle("basic-details")}>
            <div>Basic Details</div>
            {toggleBasicDetails && (
              <div>
                <i className="fa-solid fa-minus"></i>
              </div>
            )}
            {!toggleBasicDetails && (
              <div>
                <i className="fa-solid fa-plus"></i>
              </div>
            )}
          </div>
          {toggleBasicDetails && (
            <div className="dtls">
              <div className="label-n-text">
                <div className="label">Name</div>
                <div className="text">
                  <input
                    type="text"
                    value={conf.name}
                    onChange={(e) => confChanged("name", e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="dtl">
          <div className="dtl-head" onClick={() => toggle("data-details")}>
            <div>Data Details</div>
            {toggleDataDetails && (
              <div>
                <i className="fa-solid fa-minus"></i>
              </div>
            )}
            {!toggleDataDetails && (
              <div>
                <i className="fa-solid fa-plus"></i>
              </div>
            )}
          </div>
          {toggleDataDetails && (
            <div className="dtls">
              <div className="label-n-text">
                <div className="label">Source Table</div>
                <div className="text">
                  <select
                    value={form}
                    onChange={(e) => {
                      setForm(e.target.value);
                      formSelected(e.target.value);
                    }}
                  >
                    <option value="">Select</option>
                    {props.forms.map((form, idx) => {
                      return (
                        <option value={form.id} key={idx}>
                          {form.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="data-cols">
                <div className="label-n-text">
                  <div className="label">Groups</div>
                  <div className="add-data-col">
                    <i
                      className="add-icon fa-solid fa-plus"
                      onClick={() => setShowGroupAdd(true)}
                    ></i>
                    {showGroupAdd && (
                      <ColSelectionWindow
                        columns={columns}
                        selectedCols={selectedGroupCols}
                        setSelectedCols={setSelectedGroupCols}
                        windowClose={setShowGroupAdd}
                      ></ColSelectionWindow>
                    )}
                  </div>
                  <div className="grow"></div>
                </div>
                <div className="group-sel-cols">
                  {selectedGroupCols.map((col, idx) => {
                    return (
                      <div className="col">
                        <div className="col-name">{col}</div>
                        <div className="col-icon">
                          <i className="app-icon fa-solid fa-check"></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="data-cols">
                <div className="label-n-text">
                  <div className="label">Measure</div>
                  <div className="add-data-col">
                    <i
                      className="add-icon fa-solid fa-plus"
                      onClick={() => setShowMeasuresAdd(true)}
                    ></i>
                    {showMeasuresAdd && (
                      <ColSelectionWindow
                        columns={columns}
                        selectedCols={selectedMeasures.map((m) => m.col)}
                        setSelectedCols={setMeasures}
                        windowClose={setShowMeasuresAdd}
                      ></ColSelectionWindow>
                    )}
                  </div>
                  <div className="grow"></div>
                </div>
                <div className="measure-sel-cols">
                  {selectedMeasures.map((col, idx) => {
                    return (
                      <div className="measure-col">
                        <div className="measure-col-name">{col.col}</div>
                        <div className="measure-col-icon">
                          <i className="app-icon fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div className="measure-options">
                          <select
                            onChange={(e) => updateMeasure(idx, e.target.value)}
                            value={col.measure}
                          >
                            <option value={""}>---</option>
                            {config.measures.map((m, idx) => {
                              return <option value={m}>{m}</option>;
                            })}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="data-cols">
                <div className="label-n-text">
                  <div className="label">Filters</div>
                  <div className="add-data-col">
                    <i
                      className="add-icon fa-solid fa-plus"
                      onClick={() => addAFilter()}
                    ></i>
                  </div>
                  <div className="grow"></div>
                </div>
                {selectedFilters.filter.map((filter, idx) => {
                  return (
                    <div className="measure-sel-cols">
                      {filter.cols.map((col, inx) => {
                        return (
                          <div className="measure-col">
                            <div className="filter-col-name">
                              <select
                                value={col}
                                onChange={(e) =>
                                  updateFilter(
                                    idx,
                                    inx,
                                    "columns",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">----</option>
                                {columns.map((cl, ix) => {
                                  return (
                                    <option key={ix} value={cl}>
                                      {cl}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="filter-ops">
                              <select
                                value={filter.ops[inx]}
                                onChange={(e) =>
                                  updateFilter(idx, inx, "ops", e.target.value)
                                }
                              >
                                <option>--</option>
                                {config.filterOps.map((m, idx) => {
                                  return (
                                    <option key={idx} value={m}>
                                      {m}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="filter-options">
                              <input
                                type="text"
                                placeholder="condition"
                                value={filter.conds[inx]}
                                onChange={(e) =>
                                  updateFilter(
                                    idx,
                                    inx,
                                    "conditions",
                                    e.target.value
                                  )
                                }
                              ></input>
                            </div>
                            {filter.logicalOps.length != inx && (
                              <div className="logic-op">
                                <select
                                  value={filter.logicalOps[inx]}
                                  onChange={(e) =>
                                    updateFilter(
                                      idx,
                                      inx,
                                      "logicalOps",
                                      e.target.value
                                    )
                                  }
                                >
                                  {config.logicalOps.map((l, lidx) => {
                                    return <option value={l}>{l}</option>;
                                  })}
                                </select>
                              </div>
                            )}
                            {filter.logicalOps.length == inx && (
                              <div className="add-filter">
                                <i
                                  className="app-icon fa-solid fa-plus"
                                  onClick={() => addFilterTo(idx)}
                                ></i>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="dtl">
          <div className="dtl-head" onClick={() => toggle("viz-details")}>
            <div>Viz Details</div>
            {toggleVizDetails && (
              <div>
                <i className="fa-solid fa-minus"></i>
              </div>
            )}
            {!toggleVizDetails && (
              <div>
                <i className="fa-solid fa-plus"></i>
              </div>
            )}
          </div>
          {toggleVizDetails && props.conf.type === "fa-font" && (
            <div className="dtls">
              <div className="label-n-text">
                <div className="label">Background</div>
                <div className="color">
                  <input
                    type="color"
                    value={conf.statBgColor}
                    onChange={(e) => confChanged("statBgColor", e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="label-n-text">
                <div className="label">Color</div>
                <div className="color">
                  <input
                    type="color"
                    value={conf.statColor}
                    onChange={(e) => confChanged("statColor", e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="dtl">
          <div className="dtl-head" onClick={() => toggle("advanced")}>
            <div>Advanced</div>
            {toggleAdvanced && (
              <div>
                <i className="fa-solid fa-minus"></i>
              </div>
            )}
            {!toggleAdvanced && (
              <div>
                <i className="fa-solid fa-plus"></i>
              </div>
            )}
          </div>
          {toggleAdvanced && (
            <div className="dtls">
              <div className="label-n-text">
                <div className="label">Query</div>
                <div className="text">
                  <textarea
                    value={conf.advanced ? conf.query : ""}
                    onChange={(e) =>
                      confChanged("advanced.query", e.target.value)
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VizConfig;
