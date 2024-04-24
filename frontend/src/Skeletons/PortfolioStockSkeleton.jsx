import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function PortfolioStockSkeleton() {
  return (
    <Box sx={{ width: 500, height: 500, bgcolor: "background.paper", p: 1, margin:'auto', padding: 20 }}>
      <Box sx ={{display:'flex', flexDirection:'row', justifyContent: 'space-between'}}>
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
      </Box>
      <Skeleton variant="text" sx={{ fontSize: "1rem", paddingBottom: 3 }} />
      <Skeleton variant="text" sx={{ fontSize: "1rem", padding: 3  }} />
      <Skeleton variant="text" sx={{ fontSize: "1rem", padding: 3  }} />
      <Skeleton variant="text" sx={{ fontSize: "1rem", padding: 3  }} />
      <Skeleton variant="text" sx={{ fontSize: "1rem", padding: 3  }} />
    </Box>
  );
}
