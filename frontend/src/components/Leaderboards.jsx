import LeaderboardCard from "@/components/LeaderboardCard";
import LeaderBoardsTable from "@/components/LeaderboardTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import * as React from "react";
import TopLeaders from "@/components/TopLeaders";

export default function Leaderboards({ data }) {
  const [category, setCategory] = React.useState("percentage");
  const [page, setPage] = React.useState(1);
  const leadersCount = 3;
  const rowsPerPage = 5;
  const leaderboardsData =
    category === "total"
      ? [...data].sort((a, b) => b.gainLoss - a.gainLoss)
      : category === "positionSize"
      ? [...data].sort((a, b) => b.value - a.value)
      : data;

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const totalPages = Math.ceil((data.length - 3) / 5) + 1;

  // React.useEffect(() => {
  //   console.log("leaderboardsData is ", leaderboardsData);
  // }, [category]);

  return (
    <Box
      sx={{
        height: 600,
        width: 1100,
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-end", // Changed from "center"
        alignItems: "center",
        gap: page === 1 ? 1 : 6,
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
              justifyContent: "center",
            },
          }}
        />
      </Stack>
      <Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value={"total"}>Total</MenuItem>
              <MenuItem value={"percentage"}>Percentage</MenuItem>
              <MenuItem value={"positionSize"}>positionSize</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {page === 1 ? (
        <TopLeaders category={category} leaderboardsData={leaderboardsData} />
      ) : (
        <LeaderBoardsTable
          data={leaderboardsData.slice(
            (page - 2) * rowsPerPage + leadersCount,
            (page - 1) * rowsPerPage + leadersCount
          )}
        />
      )}
    </Box>
  );
}
