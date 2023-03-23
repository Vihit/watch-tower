import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./AppVizs.css";

function AppVizs(props) {
  const [isOpen, setIsOpen] = useState(false);

  let history = useHistory();

  function goToAnalytics(viz) {
    history.push("/analytics-viz", viz);
  }

  function goToEdit(viz) {
    history.push("/create-analytics", viz);
  }

  return (
    <div className="app-lvl">
      <div className="app-lvl-name" onClick={() => setIsOpen(!isOpen)}>
        <div className="app-css">
          <div>{props.app.name}</div>{" "}
          <div className="viz-count">{props.vizs.length}</div>
        </div>
        <div>
          {!isOpen && <i className="fa-solid fa-plus"></i>}
          {isOpen && <i className="fa-solid fa-minus"></i>}
        </div>
      </div>
      <div className={"viz-lvl " + (!isOpen ? "close-flex" : "")}>
        {props.vizs.map((viz, idx) => {
          return (
            <div key={idx} className="viz-lvl-name">
              <div className="viz-n" onClick={() => goToAnalytics(viz)}>
                {viz.name}
              </div>
              <div className="viz-i" onClick={() => goToEdit(viz)}>
                <i className="fa-solid fa-edit"></i>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AppVizs;
