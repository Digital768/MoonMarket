import React from 'react';
import { Typography, Tooltip } from '@mui/material';

const TooltipContent = ({ data }) => {
  return (
    <div>
      <Typography variant="body1">Ticker: {data.ticker}</Typography>
      <Typography variant="body1">Quantity: {data.quantity}</Typography>
      <Typography variant="body1">Percentage of Portfolio: {data.percentageOfPortfolio}%</Typography>
      <Typography variant="body1">Price Change Percentage: {data.priceChangePercentage}%</Typography>
      {/* Add any other properties you want to display */}
    </div>
  );
};

export default TooltipContent;