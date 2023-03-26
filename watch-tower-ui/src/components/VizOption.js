import { useDrag } from "react-dnd";
import "./VizOption.css";

function VizOption(props) {
  const [{ isDragging }, drag] = useDrag({
    type: "viz-option",
    item: {
      type: "viz-option",
      name: props.type,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      className={"viz-option " + (isDragging ? "viz-option-dragging" : "")}
    >
      {/* <i className={"fa-solid " + props.type}></i> */}
      <div className={"viz-img " + props.type + "-png"}></div>
    </div>
  );
}

export default VizOption;
