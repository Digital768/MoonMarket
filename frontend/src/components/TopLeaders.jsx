import LeaderboardCard from "@/components/LeaderboardCard";
import { Box } from "@mui/material";


function TopLeaders({ leaderboardsData, category }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "inherit",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundRepeat: "repeat",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
        }}
      >
        <LeaderboardCard
          Number={2}
          ticker={leaderboardsData[1].ticker}
          changeCount={
            category === "percentage"
              ? leaderboardsData[1].priceChangePercentage + "%"
              : category === "positionSize"
              ? leaderboardsData[1].value + "$"
              : leaderboardsData[1].gainLoss + "$"
          }
        />
        <LeaderboardCard
          Number={1}
          ticker={leaderboardsData[0].ticker}
          changeCount={
            category === "percentage"
              ? leaderboardsData[0].priceChangePercentage + "%"
              : category === "positionSize"
              ? leaderboardsData[1].value + "$"
              : leaderboardsData[0].gainLoss + "$"
          }
        />
        <LeaderboardCard
          Number={3}
          ticker={leaderboardsData[2].ticker}
          changeCount={
            category === "percentage"
              ? leaderboardsData[2].priceChangePercentage + "%"
              : category === "positionSize"
              ? leaderboardsData[1].value + "$"
              : leaderboardsData[2].gainLoss + "$"
          }
        />
      </Box>
    </Box>
  );
}

export default TopLeaders;
