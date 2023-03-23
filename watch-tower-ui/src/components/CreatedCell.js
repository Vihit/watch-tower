import BarChart from "./vizs/BarChart";
import "./CreatedCell.css";
import LineChart from "./vizs/LineChart";
import PieChart from "./vizs/PieChart";
import StatValue from "./vizs/StatValue";

function CreatedCell(props) {
  return (
    <div className="created-cell ">
      {props.conf.type === "fa-chart-simple" && (
        <BarChart title={props.conf.name} conf={props.conf}></BarChart>
      )}
      {props.conf.type === "fa-chart-pie" && (
        <PieChart title={props.conf.name} conf={props.conf}></PieChart>
      )}
      {props.conf.type === "fa-font" && (
        <StatValue title={props.conf.name} conf={props.conf}></StatValue>
      )}
      {props.conf.type === "fa-chart-line" && (
        <LineChart title={props.conf.name} conf={props.conf}></LineChart>
      )}
    </div>
  );
}

export default CreatedCell;
