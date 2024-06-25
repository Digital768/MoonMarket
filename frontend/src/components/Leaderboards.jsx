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

function LeaderboardCard({ Number, ticker, changeCount }) {
    return (
      <Card
        sx={{
          height: 400,
          width: 280,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "transparent", // Add this line
          boxShadow: "none",
        }}
      >
        <Box
          className="Content"
          sx={{
            backgroundColor: "transparent",
            flex: 1,
            gap: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            margin: "auto",
            position: "relative",
            width: "100%",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "100%",
              background:
                Number === 1
                  ? "linear-gradient(to top, rgba(255, 212, 59, 0.2) 0%, rgba(255, 212, 59, 0) 100%)"
                  : Number === 2
                  ? "linear-gradient(to top, rgba(116, 192, 252, 0.2) 0%, rgba(116, 192, 252, 0) 100%)"
                  : Number === 3
                  ? "linear-gradient(to top, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0) 100%)"
                  : "none",
              zIndex: -1,
            },
          }}
        >
          <FontAwesomeIcon
            icon={faCrown}
            style={{
              color:
                Number === 1 ? "#FFD43B" : Number === 2 ? "#74C0FC" : "#9ca7b0",
              height: 40,
            }}
          />
          <Avatar>
            <ShowChartSharpIcon />
          </Avatar>
          <Typography>{ticker}</Typography>
          <Typography>{changeCount}%</Typography>
          <FolderIcon />
        </Box>
        <Box
          className="Number"
          sx={{
            textAlign: "center",
            backgroundColor: "background.paper", // Keep the original background color
            height: Number === 1 ? "35%" : "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)", // Light border for contrast
            boxShadow:
              "0 -4px 8px -1px rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(255, 255, 255, 0.1) inset", // Adjusted shadow for 3D effect
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            sx={{
              color: "white", // Ensure text is visible on dark background
            }}
          >
            #{Number}
          </Typography>
        </Box>
      </Card>
    );
  }
 export default function Leaderboards({ data }) {

    React.useEffect(() => {
        console.log(data)
    },[])
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            boxShadow: '0 0 0 1px rgba(211, 211, 211, 0.5)',  // Light grey, semi-transparent
            padding: 2, // This adds padding to the Stack
          }}
        >
          <Pagination
            count={10}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
            sx={{
              "& .MuiPagination-ul": {
                gap: 2, // This increases the gap between PaginationItems
              },
            }}
          />
        </Stack>
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
          }}
        >
          <LeaderboardCard
            Number={2}
            ticker={data[1].ticker}
            changeCount={data[1].priceChangePercentage}
          ></LeaderboardCard>
          <LeaderboardCard
            Number={1}
            ticker={data[0].ticker}
            changeCount={data[0].priceChangePercentage}
          ></LeaderboardCard>
          <LeaderboardCard
            Number={3}
            ticker={data[2].ticker}
            changeCount={data[2].priceChangePercentage}
          ></LeaderboardCard>
        </Box>
      </Box>
    );
  }
  
  