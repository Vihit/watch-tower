import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import "./AnalyticsViz.css";
import CreatedCell from "./CreatedCell";

function AnalyticsViz(props) {
  const location = useLocation();
  const viz = location.state;
  const layout = JSON.parse(viz.template).layout;
  const conf = JSON.parse(viz.template).vizs;

  return (
    <div className="analytics-actual">
      <div className="viz-preview-details">
        <div className="viz-name">{viz.name}</div>
        {/* {
          <div className="viz-filter">
            <i className="fa-solid fa-filter"></i>
            <select>
              <option>{props.filter}</option>
              <option>1111</option>
              <option>2111</option>
            </select>
          </div> */}

        <div className="grow"></div>
      </div>
      <div className="created-container">
        {layout.map((rows, idx) => {
          return (
            <div
              key={idx}
              className="created-row"
              style={{ height: "calc(100%/" + layout.length + ")" }}
            >
              {rows.map((row, inx) => {
                return (
                  <CreatedCell
                    rowId={idx}
                    colId={inx}
                    totalCells={rows.length}
                    conf={conf[idx][inx]}
                    key={"1" + idx + "" + inx}
                  ></CreatedCell>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AnalyticsViz;
