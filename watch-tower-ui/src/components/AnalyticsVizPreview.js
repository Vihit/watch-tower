import "./AnalyticsVizPreview.css";
import CreatedCell from "./CreatedCell";

function AnalyticsVizPreview(props) {
  const layout = props.layout;
  const conf = props.conf;

  return (
    <div className="analytics-preview">
      <div className="viz-preview-details">
        <div className="viz-name">{props.vizName}</div>
        {props.filter.length > 0 && (
          <div className="viz-filter">
            <i className="fa-solid fa-filter"></i>
            <select>
              <option>{props.filter}</option>
              <option>1111</option>
              <option>2111</option>
            </select>
          </div>
        )}
        <div className="grow"></div>
        <div className="close-icon">
          <i
            className="fa-solid fa-close"
            onClick={() => props.closePreview(false)}
          ></i>
        </div>
      </div>
      <div className="created-container">
        {layout.map((rows, idx) => {
          return (
            <div
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

export default AnalyticsVizPreview;
