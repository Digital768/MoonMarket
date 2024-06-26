import * as React from "react";
import { useState, useContext } from "react";
import { Box, Button } from "@mui/material";
import ReactVirtualizedTable from "@/components/TableChart";
import Leaderboards from "@/components/Leaderboards";
import { GraphContext } from "@/pages/ProtectedRoute";

export default function DetailsChart({ data }) {
  const [view, setview] = useState("table");
  const { setSelectedGraph } = useContext(GraphContext);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Button
        variant="outlined"
        sx={{
          maxWidth: "10em",
        }}
        onClick={() => {
          if (view === "table") {
            setview("Leaderboards");
            setSelectedGraph("Leaderboards");
          } else {
            setview("table");
            setSelectedGraph("TableGraph");
          }
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
