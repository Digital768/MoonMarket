// DonutSkeleton.jsx
import React from 'react';
import { Box, CircularProgress } from "@mui/material";

const DonutSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 500,
        height: 500,
        backgroundColor:'background.paper',
        borderRadius: '50%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default DonutSkeleton;
