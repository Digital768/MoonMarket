import { useMemo, useRef } from "react";
import * as d3 from "d3";
// import { FaPlus } from "react-icons/fa6";
import "./Treemap.css";
// import SharesDialog from "./SharesDialog.jsx";
// import { FaMinus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const colors = {
  positive: "#a4c969",
  negative: "#e85252",
};

export const Treemap = ({ width, height, data, deletestock, addStockShares, decreaseStockShares }) => {
  const navigate = useNavigate();
  // const [leafDataId, setLeafDataId] = useState(null);
  const tooltipRef = useRef(null);
  // const [dialogOpen, setdialogOpen] = useState(false);
  // const [dialog, setDialog] = useState({
  //   title: '',
  //   text: '',
  //   labelText: '',
  //   function: '',
  //   buttonText: '',
  //   stock: {}
  // });

  // function handleClose () {
  //   setdialogOpen(false)
  // }

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
            <p>Avarage share price:</p>
            <p>${data.avgSharePrice}$</p>
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

  // const deleteStockWithConfirmation = (id) => {
  //   if (window.confirm("Are you sure you want to delete this stock?")) {
  //     deletestock(id);
  //   }
  // };

  const navigateToStockPage = (ticker) => {
    navigate(`/stock/${ticker}`);
  };

  const allShapes = root.leaves().map((leaf, i) => {
    const parentName = leaf.parent?.data.name;
    const centerX = (leaf.x0 + leaf.x1) / 2;
    const centerY = (leaf.y0 + leaf.y1) / 2;

    // const handleDeleteClick = (event) => {
    //   event.stopPropagation(); // Prevent the parent click event from firing
    //   deleteStockWithConfirmation(leaf.data.id);
    // };
    // const handleAddClick = () => {
    //   // event.stopPropagation(); // Prevent the parent
    //   setLeafDataId(leaf.data.id)
    //   setdialogOpen(true);
    //   setDialog((prevDialog) => {
    //     const newDialog = {
    //       ...prevDialog,
    //       title: 'Add shares',
    //       text : 'To add shares of the stock, please enter how many shares of the stock you bought and at which price.',
    //       labelText: 'Enter bought price',
    //       function: addStockShares,
    //       buttonText: 'Add',
    //       stock: leaf.data
    //     }
    //     return newDialog
    //   })
    // };
    // const handleDecreaseClick = () => {
    //   // event.stopPropagation(); // Prevent the parent
    //   setLeafDataId(leaf.data.id)
    //   setdialogOpen(true);
    //   setDialog((prevDialog) => {
    //     const newDialog = {
    //       ...prevDialog,
    //       title: 'Sell shares',
    //       text : 'To sell shares of the stock, please enter how many shares of the stock you sold and at which price.',
    //       labelText: 'Enter sold price',
    //       function: decreaseStockShares,
    //       buttonText: 'Sell',
    //       stock: leaf.data
    //     }
    //     return newDialog
    //   })
    // };

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
          onClick={() => navigateToStockPage(leaf.data.ticker)}
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
        {/* {leaf.data.id === leaf.data.id && (
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
            x={leaf.x1 - 35}
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
        {leaf.data.id === leaf.data.id && (
          <FaMinus
            x={leaf.x1 - 55}
            y={leaf.y0 + 10}
            fontSize={12}
            textAnchor="end"
            alignmentBaseline="hanging"
            fill="white"
            className="font-bold"
            onClick={handleDecreaseClick}
            style={{ cursor: "pointer" }}
          />
        )} */}
      </g>
    );
  });

  return (
    <div>
      <div ref={tooltipRef} className="tooltip" />
      <svg width={width} height={height} className="container">
        {allShapes}
      </svg>
      {/* {dialogOpen && (
        <SharesDialog open ={dialogOpen} handleClose ={handleClose} dialog={dialog}  id={leafDataId}></SharesDialog>
      )} */}
    </div>
  );
};
