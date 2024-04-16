import { useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { FaPlus } from "react-icons/fa6";
import "./Treemap.css";
import AddSharesDialog from "./AddSharesDialog.jsx";

const colors = {
  positive: "#a4c969",
  negative: "#e85252",
};

export const Treemap = ({ width, height, data, deletestock, updateStockShares }) => {
  const [leafDataId, setLeafDataId] = useState(null);
  const tooltipRef = useRef(null);
  const [dialogOpen, setdialogOpen] = useState(false);

  function handleClose () {
    setdialogOpen(false)
  }

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
    event.stopPropagation();
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "visible").html(`
        <div style="width: 200px;"><h4 style="margin: 2px">${
          data.name
        }</h4></div>
        <hr>
        <div style="display: flex; flex-direction: row; width: fit-content; height: fit-content;">
          <ul style="list-style-type: none; margin: 0; padding: 0; width: 200px;">
            <li style="display: flex; justify-content: space-between; margin: 0; padding: 0; margin-bottom: 0;">
              <p>In your portfolio</p>
              <p>${data.percentageOfPortfolio}%</p>
            </li>
            <li style="display: flex; justify-content: space-between; margin: 0; padding: 0; margin-bottom: 0;">
              <p>Value (${data.quantity} shares)</p>
              <p>${data.value.toLocaleString("en-US")}$</p>
            </li>
            <li style="display: flex; justify-content: space-between; margin: 0; padding: 0; margin-bottom: 0;">
              <p>Last price</p>
              <p>${data.last_price}$</p>
            </li>
          </ul>
        </div>
      `);
  };

  const mousemove = (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style("top", `${event.pageY + 10}px`)
      .style("left", `${event.pageX + 10}px`);
  };

  const hideTooltip = () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("visibility", "hidden");
  };

  const deleteStockWithConfirmation = (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      deletestock(id);
    }
  };

  const allShapes = root.leaves().map((leaf, i) => {
    const parentName = leaf.parent?.data.name;
    const centerX = (leaf.x0 + leaf.x1) / 2;
    const centerY = (leaf.y0 + leaf.y1) / 2;

    const handleDeleteClick = (event) => {
      event.stopPropagation(); // Prevent the parent click event from firing
      deleteStockWithConfirmation(leaf.data.id);
    };
    const handleAddClick = () => {
      // event.stopPropagation(); // Prevent the parent
      setLeafDataId(leaf.data.id)
      setdialogOpen(true);
    };

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
          x={centerX}
          y={centerY - 6}
          fontSize={12}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          className="font-bold"
        >
          {leaf.data.ticker}
        </text>
        <text
          x={centerX}
          y={centerY + 6}
          fontSize={12}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          className="font-light"
        >
          {leaf.data.priceChangePercentage}%
        </text>
        {leaf.data.id === leaf.data.id && (
          <text
            x={leaf.x1 - 10}
            y={leaf.y0 + 10}
            fontSize={12}
            textAnchor="end"
            alignmentBaseline="hanging"
            fill="white"
            className="font-bold"
            onClick={handleDeleteClick}
            style={{ cursor: "pointer" }}
          >
            X
          </text>
        )}
        {leaf.data.id === leaf.data.id && (
          <FaPlus
            x={leaf.x1 - 40}
            y={leaf.y0 + 10}
            fontSize={12}
            textAnchor="end"
            alignmentBaseline="hanging"
            fill="white"
            className="font-bold"
            onClick={handleAddClick}
            style={{ cursor: "pointer" }}
          />
        )}
      </g>
    );
  });

  return (
    <div>
      <div ref={tooltipRef} className="tooltip" />
      <svg width={width} height={height} className="container">
        {allShapes}
      </svg>
      {dialogOpen && (
        <AddSharesDialog open ={dialogOpen} handleClose ={handleClose} updateStockShares={updateStockShares} id={leafDataId}></AddSharesDialog>
      )}
    </div>
  );
};
