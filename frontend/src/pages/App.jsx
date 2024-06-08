import TreeMapSkeleton from "@/Skeletons/TreeMapSkeleton";
import { updateStockPrice } from "@/api/stock";
import SearchBar from "@/components/SearchBar.jsx";
import { Treemap } from "@/components/Treemap";
import useTreeMapData from "@/hooks/useTreeMapData";
import { useAuth } from "@/pages/AuthProvider";
import { getUserData } from '@/api/user'
import { useFetcher, useLoaderData } from "react-router-dom";
import { lastUpdateDate } from '@/utils/dataProcessing'
import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';  
import SyncIcon from '@mui/icons-material/Sync';
import { useEffect } from "react";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const tickers = formData.get("tickers").split(",");
  const token = formData.get("token");

  if (!tickers || tickers.length === 0) {
    console.warn("No tickers available for price update.");
    return null;
  }

  if (!token) {
    console.warn("No authentication token available.");
    return null;
  }

  try {
    const promises = tickers.map((ticker) => updateStockPrice(ticker, token));
    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        // console.log(`Successfully updated ${tickers[index]}:`, result.value);
      } else {
        console.error(`Failed to update ${tickers[index]}:`, result.reason);
      }
    });

    return results;
  } catch (error) {
    console.error("Error updating stock prices:", error);
    return null;
  }
}

export const loader = (token) => async () => {
  // console.log("loader activated")
  const user = await getUserData(token)
  // console.log("user: " , user.data)
  return user
}

function App() {
  const { token } = useAuth();
  const fetcher = useFetcher();
  const data = useLoaderData();
  const [stockTickers, visualizationData, value, moneySpent] = useTreeMapData(data);
  const { formattedDate } = lastUpdateDate(data);
  const incrementalChange = (value - moneySpent)
  const percentageChange = ((incrementalChange / value) * 100)

  useEffect(() => {
    console.log(percentageChange)
  }, [data]);

  return (
    <Box className="App" sx={{
      display: 'flex',
      flexDirection: 'row-reverse',
      height: '100%',
      margin: 'auto'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        paddingTop: '7rem',
        paddingLeft: '5rem'
      }}>
        <Container>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: '10em',
          }}>
            <Box className="portfolio-details" sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <Typography variant="h3">{value.toLocaleString("en-US")}$</Typography>
              <Typography variant="body1" color={"#596ee7"} sx={{ paddingLeft: '1em' }}>{incrementalChange.toLocaleString("en-US")}$ ({percentageChange.toLocaleString('en-US')}%) Overall</Typography>

            </Box>
            <fetcher.Form method="post" >
              <input type="hidden" name="tickers" value={stockTickers.join(",")} />
              <input type="hidden" name="token" value={token} />
              <Tooltip title="Click to refresh Stocks price" placement="right">
              <Button sx={{
              marginTop: '15px',
              marginLeft: '25px',
              justifyContent:'flex-end'
            }}
                variant="outlined"
                type="submit"
                startIcon={<SyncIcon />}
              >
              </Button>
              </Tooltip>
            </fetcher.Form>
          </Box>
          <SearchBar />
        </Container>
      </Box>
      <Box sx={{
        flexGrow: 1,
        margin: 'auto',
        padding: 0
      }}>

        {!visualizationData || visualizationData.children.length === 0 ? (
          <TreeMapSkeleton />
        ) : (
          <Treemap data={visualizationData} width={1000} height={600} />
        )}

      </Box>
    </Box>
  );
}

export default App;
