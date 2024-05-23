import { useMemo, useRef } from "react";
import * as React from "react";
import * as d3 from "d3";
import "@/styles/Treemap.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
// import { Typography } from '@mui/material';
import TooltipContent from "@/components/Tooltip";

export const Treemap = ({ width, height, data }) => {
  const navigate = useNavigate();
  const tooltipRef = useRef(null);
  const theme = useTheme();
  const colors = {
    positive: theme.palette.success.main,
    // positive: "#a4c969",
    negative: theme.palette.error.main,
  };
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
  }, [hierarchy]);

  const navigateToStockPage = (data) => {
    navigate(`/portfolio/${data.ticker}`, {
      state: {
        quantity: data.quantity,
        percentageOfPortfolio: data.percentageOfPortfolio,
      },
    });
  };

  const allShapes = root.leaves().map((leaf, i) => {
    const parentName = leaf.parent?.data.name;
    const centerX = (leaf.x0 + leaf.x1) / 2;
    const centerY = (leaf.y0 + leaf.y1) / 2;

    return (
      <Tooltip
        followCursor
        title={<TooltipContent data={leaf.data} />}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 14],
                },
              },
            ],
          },
        }}
      >
        <g key={i} className="rectangle">
          <rect
            x={leaf.x0}
            y={leaf.y0}
            width={leaf.x1 - leaf.x0}
            height={leaf.y1 - leaf.y0}
            stroke="transparent"
            fill={colorScale(parentName)}
            className={"opacity-80 hover:opacity-100"}
            onClick={() => navigateToStockPage(leaf.data)}
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
        </g>
      </Tooltip>
    );
  });

  return (
    <div>
      <svg width={width} height={height} className="container">
        {allShapes}
      </svg>
    </div>
  );
};
