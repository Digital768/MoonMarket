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
import { Box, Button, Card, Typography, CardContent } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import Avatar from '@mui/material/Avatar';
import ShowChartSharpIcon from '@mui/icons-material/ShowChartSharp';
import FolderIcon from '@mui/icons-material/Folder';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


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


function LeaderboardCard({ Number, ticker, changeCount }) {

  return (
    <Card sx={{
      height: 400, width: 280, display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'transparent', // Add this line
      boxShadow: 'none',
    }}>
      <Box className="Content" sx={{
        backgroundColor: "transparent",
        flex: 1,
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        margin: 'auto',
        position: 'relative',
        width: "100%",
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: Number === 1
            ? 'linear-gradient(to top, rgba(255, 212, 59, 0.2) 0%, rgba(255, 212, 59, 0) 100%)'
            : Number === 2
              ? 'linear-gradient(to top, rgba(116, 192, 252, 0.2) 0%, rgba(116, 192, 252, 0) 100%)'
              : Number === 3
                ? 'linear-gradient(to top, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0) 100%)'
                : 'none',
          zIndex: -1,
        }
      }}>
        <FontAwesomeIcon icon={faCrown} style={{ color: Number === 1 ? "#FFD43B" : Number === 2 ? "#74C0FC" : "#9ca7b0", height: 40 }} />
        <Avatar >
          <ShowChartSharpIcon />
        </Avatar>
        <Typography>{ticker}</Typography>
        <Typography>{changeCount}</Typography>
        <FolderIcon />


      </Box>
      <Box className="Number" sx={{
        textAlign: 'center',
        backgroundColor: 'background.paper', // Keep the original background color
        height: Number === 1 ? "35%" : "25%",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Light border for contrast
        boxShadow: '0 -4px 8px -1px rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(255, 255, 255, 0.1) inset', // Adjusted shadow for 3D effect
        position: 'relative',
        zIndex: 1,
      }}>
        <Typography sx={{
          color: 'white', // Ensure text is visible on dark background
        }}>#{Number}</Typography>
      </Box>
    </Card>
  );
}
function Leaderboards({ data }) {
  return (
    <Box sx={{display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      gap:2
    }}>
      <Stack spacing={2}>
        <Pagination
          count={10}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          backgroundColor: 'inherit',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundRepeat: 'repeat',
          width: '100%',
          height: '100%',
        }}
      >
        <LeaderboardCard Number={2} ticker={"NVDA"} changeCount={500} ></LeaderboardCard>
        <LeaderboardCard Number={1} ticker={"AAPL"} changeCount={650}></LeaderboardCard>
        <LeaderboardCard Number={3} ticker={"MSFT"} changeCount={200}></LeaderboardCard>
      </Box>
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
