import * as React from "react";
import { Box, Card, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
import ShowChartSharpIcon from "@mui/icons-material/ShowChartSharp";
import FolderIcon from "@mui/icons-material/Folder";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LeaderboardCard from "@/components/LeaderboardCard";
import BasicTable from "@/components/LeaderboardTable";

export default function Leaderboards({ data }) {
  const [page, setPage] = React.useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const totalPages = Math.ceil((data.length - 3) / 5) + 1;

  React.useEffect(() => {
    console.log(data);
  }, []);
  return (
    <Box
      sx={{
        height: 600,
        width: 1100,
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-end", // Changed from "center"
        alignItems: "center",
        gap: page ===1 ? 1: 6
      }}
    >
      <Stack
        spacing={2}
        sx={{
          boxShadow: "0 0 0 1px rgba(211, 211, 211, 0.5)",
          padding: 2,
          width: "100%",
        }}
      >
        <Pagination
          count={totalPages}
          onChange={handleChange}
          page={page}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
          sx={{
            "& .MuiPagination-ul": {
              gap: 2,
              justifyContent: 'center'
            },
          }}
        />
      </Stack>
      {page === 1 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            backgroundColor: "inherit",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundRepeat: "repeat",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LeaderboardCard
            Number={2}
            ticker={data[1].ticker}
            changeCount={data[1].priceChangePercentage}
          />
          <LeaderboardCard
            Number={1}
            ticker={data[0].ticker}
            changeCount={data[0].priceChangePercentage}
          />
          <LeaderboardCard
            Number={3}
            ticker={data[2].ticker}
            changeCount={data[2].priceChangePercentage}
          />
        </Box>
      ) : (
        <BasicTable data={data.slice((page - 2) * 5 + 3, (page - 1) * 5 + 3)} />
      )}
    </Box>
  );
}
