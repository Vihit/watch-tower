import { useState } from "react";
import { useDrop } from "react-dnd";
import "./CreationCell.css";

function CreationCell(props) {
  const [viz, setViz] = useState(props.conf.type);

  const [{ isOver }, drop] = useDrop({
    accept: "viz-option",
    drop: (item, monitor) => {
      vizDropped(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  function vizDropped(item) {
    setViz(item.name);
    props.vizChosen(item.name, props.rowId, props.colId);
  }

  function cellClicked() {
    if (viz !== "") props.showConf(props.rowId, props.colId);
  }
  return (
    <div
      ref={drop}
      className={
        "creation-cell " +
        (isOver ? "item-drop" : "") +
        (props.clicked ? " clicked-cell" : "")
      }
      style={{ width: "calc(100%/" + props.totalCells + ")" }}
      onClick={cellClicked}
    >
      {viz !== "" && <i className={"fa-solid " + viz}></i>}
      <div className="cell-name">{props.conf.name}</div>
    </div>
  );
}

export default CreationCell;
