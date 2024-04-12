import { useMemo, useRef } from "react";
import * as d3 from "d3";
import "./Treemap.css";

const colors = {
  positive: "#a4c969",
  negative: "#e85252",
};

export const Treemap = ({ width, height, data }) => {
  const tooltipRef = useRef(null);

  const hierarchy = useMemo(() => {
    return d3.hierarchy(data).sum((d) => d.value);
  }, [data]);

  // List of item of level 1 (just under root)
  const firstLevelGroups = hierarchy?.children?.map((child) => child.data.name);

  const colorScale = useMemo(() => {
    return d3
      .scaleOrdinal()
      .domain(firstLevelGroups || [])
      .range(
        firstLevelGroups?.map((name) =>
          name === "Positive" ? colors.positive : colors.negative
        )
      );
  }, [firstLevelGroups]);

  const root = useMemo(() => {
    const treeGenerator = d3.treemap().size([width, height]).padding(4);
    return treeGenerator(hierarchy);
  }, [hierarchy, width, height]);

  const showTooltip = (event, data) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "visible")
      .html(`${data.name}<br>${data.value}`);
  };
  
  const mousemove = (event, data) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("top", `${event.pageY + 10}px`)
      .style("left", `${event.pageX + 10}px`);
  };

  const hideTooltip = () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "hidden");
  };

  const allShapes = root.leaves().map((leaf, i) => {
    const parentName = leaf.parent?.data.name;
    return (
      <g
        key={leaf.id}
        className="rectangle"
        onMouseOver={(event) => showTooltip(event, leaf.data)}
        onMouseMove={(event) => mousemove(event, leaf.data)}
        onMouseOut={hideTooltip}
      >
        <rect
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          stroke="transparent"
          fill={colorScale(parentName)}
          className={"opacity-80 hover:opacity-100"}
        />
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 3}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="font-bold"
        >
          {leaf.data.name}
        </text>
        <text
          x={leaf.x0 + 3}
          y={leaf.y0 + 18}
          fontSize={12}
          textAnchor="start"
          alignmentBaseline="hanging"
          fill="white"
          className="font-light"
        >
          {leaf.data.value}
        </text>
      </g>
    );
  });

  return (
    <div>
      <div ref={tooltipRef} className="tooltip" />
      <svg width={width} height={height} className="container">
        {allShapes}
      </svg>
    </div>
  );
};