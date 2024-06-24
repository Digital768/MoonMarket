import * as React from "react";
import { useState } from "react";
import { useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import { useNavigate } from "react-router-dom";
import { Box, Button, Card } from "@mui/material";

const scrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "3px",
    "&:hover": {
      backgroundColor: "#555",
    },
  },
};

const columns = [
  {
    width: 250,
    label: "Company",
    dataKey: "name",
  },
  {
    width: 120,
    label: "SharePrice",
    dataKey: "sharePrice",
    numeric: true,
  },
  {
    width: 120,
    label: "PriceChange",
    dataKey: "priceChange",
    numeric: true,
  },
  {
    width: 120,
    label: "PositionValue",
    dataKey: "value",
    numeric: true,
  },
  {
    width: 120,
    label: "Earnings",
    dataKey: "earnings",
    numeric: true,
  },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer
      component={Paper}
      {...props}
      ref={ref}
      sx={{
        ...scrollbarStyles,
      }}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
            color: "rgba(200, 200, 200, 0.5)",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function ReactVirtualizedTable({ data }) {
  const navigate = useNavigate();
  const navigateToStockPage = useCallback(
    (row) => {
      navigate(`/portfolio/${row.ticker}`, {
        state: {
          quantity: row.quantity,
          percentageOfPortfolio: row.percentageOfPortfolio,
        },
      });
    },
    [navigate]
  );

  const formatPriceChange = (change, percentage) => {
    const isPositive = change >= 0;
    const color = isPositive ? "green" : "red";
    const sign = isPositive ? "+" : "";
    return (
      <span style={{ color }}>
        {`${sign}${change.toFixed(2)}(${sign}${percentage.toFixed(2)}%)`}
      </span>
    );
  };

  const formatValue = (value) => {
    return value.toFixed(2) + "$";
  };

  const formatEarnings = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const rowContent = useCallback(
    (_index, row) => {
      return (
        <React.Fragment>
          {columns.map((column, columnIndex) => (
            <TableCell
              key={column.dataKey}
              align={column.numeric || false ? "right" : "left"}
              onClick={() => navigateToStockPage(row)}
              sx={{
                // cursor: 'pointer',
                ...(columnIndex === 0
                  ? {
                      textShadow: "0px 0px 1px rgba(255, 255, 255, 0.5)",
                    }
                  : {}),
              }}
            >
              {column.dataKey === "name" ? (
                <div>
                  <span
                    style={{
                      color: "white",
                      fontWeight: "700",
                      fontSize: "1.1em",
                    }}
                  >
                    {row.ticker}
                  </span>{" "}
                  <span style={{ color: "#B0B0B0", fontSize: "0.9em" }}>
                    {row.name}
                  </span>
                </div>
              ) : column.dataKey === "priceChange" ? (
                formatPriceChange(row.priceChange, row.priceChangePercentage)
              ) : column.dataKey === "value" ? (
                formatValue(row.value)
              ) : column.dataKey === "sharePrice" ? (
                row[column.dataKey] + "$"
              ) : column.dataKey === "earnings" ? (
                formatEarnings(row[column.dataKey])
              ) : (
                row[column.dataKey]
              )}
            </TableCell>
          ))}
        </React.Fragment>
      );
    },
    [navigateToStockPage]
  );

  return (
    <Paper
      style={{ height: 600, width: 1100 }}
      sx={scrollbarStyles}
      className="stocks-Table"
    >
      <TableVirtuoso
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}

function Leaderboards({ data }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      <Card>Second place</Card>
      <Card>First place</Card>
      <Card>ThirdPlace</Card>
    </Box>
  );
}

export default function DetailsChart({ data }) {
  const [view, setview] = useState("table");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Button
        sx={{
          maxWidth: "10em",
          justifyContent: "flex-start",
        }}
        onClick={() => {
          view === "table" ? setview("Leaderboards") : setview("table");
        }}
      >
        {view === "table" ? "Leaderboards" : "table"}
      </Button>
      {view === "table" ? (
        <ReactVirtualizedTable data={data} />
      ) : (
        <Leaderboards data={data} />
      )}
    </Box>
  );
}
