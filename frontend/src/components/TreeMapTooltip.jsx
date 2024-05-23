import { Tooltip, Typography, Divider, Box } from "@mui/material";
import '@/styles/tooltip.css'

function TreeMapTooltip({
  children,
  ticker,
  quantity,
  percentageOfPortfolio,
  value,
  last_price,
  avgSharePrice,
}) {
  return (
    <Tooltip
      followCursor
      title={
        <Box
          sx={{
            width: "250px",
            display: "flex",
            flexDirection: "column",
            padding: 2,
          }}
        >
          <Typography variant="body1">{ticker}</Typography>
          <Divider />
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li className="tooltip-data-row">
              <Typography variant="body2">
                In your portfolio 
              </Typography>
               <Typography variant="body2">{percentageOfPortfolio}%</Typography>
            </li>
            <li className="tooltip-data-row">
              <Typography variant="body2">
                Value: ({quantity} shares)
              </Typography>
              <Typography variant="body2">{value.toLocaleString("en-US")}$</Typography>
              {/* <Typography variant="body2"></Typography> */}
            </li>
            <li className="tooltip-data-row">
              <Typography variant="body2">last price </Typography>
              <Typography variant="body2">{last_price}$</Typography>
            </li>
            <li className="tooltip-data-row">
              <Typography variant="body2">
                Avarge share price 
              </Typography>
               <Typography variant="body2">{avgSharePrice}$</Typography>
            </li>
          </ul>
          {/* Add any other properties you want to display */}
        </Box>
      }
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        },
      }}
    >
      {children}
    </Tooltip>
  );
}

export default TreeMapTooltip;
// const TooltipContent = ({
//   children,
//   ticker,
//   quantity,
//   percentageOfPortfolio,
//   priceChangePercentage,
// }) => {
//   return (
//     <Tooltip
//       followCursor
//       title={
//         <div>
//           <Typography variant="body1">Ticker: {ticker}</Typography>
//           <Typography variant="body1">Quantity: {quantity}</Typography>
//           <Typography variant="body1">
//             Percentage of Portfolio: {percentageOfPortfolio}%
//           </Typography>
//           <Typography variant="body1">
//             Price Change Percentage: {priceChangePercentage}%
//           </Typography>
//           {/* Add any other properties you want to display */}
//         </div>
//       }
//       slotProps={{
//         popper: {
//           modifiers: [
//             {
//               name: "offset",
//               options: {
//                 offset: [0, 14],
//               },
//             },
//           ],
//         },
//       }}
//     >
//       {children}
//     </Tooltip>
//   );
// };

// export default TooltipContent;
