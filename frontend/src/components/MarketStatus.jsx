import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const MarketStatus = () => {
    const [status, setStatus] = useState('');

    useEffect(() => {
        const updateStatus = () => {
            const now = new Date();
            const israelTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));
            const day = israelTime.getDay();
            const hours = israelTime.getHours();
            const minutes = israelTime.getMinutes();
            const time = hours * 60 + minutes;

            // Adjust these times based on the current time difference
            // This assumes a 7-hour difference. Adjust if it's daylight saving time.
            if (day === 0 || day === 6) {
                setStatus('Closed (Weekend)');
            } else if (time >= 1140 || time < 30) { // 7:00 PM to 12:30 AM Israel time
                setStatus('Pre-market');
            } else if (time >= 30 && time < 420) { // 12:30 AM to 7:00 PM Israel time
                setStatus('Regular market');
            } else if (time >= 420 && time < 660) { // 7:00 PM to 11:00 PM Israel time
                setStatus('After-market');
            } else {
                setStatus('Closed');
            }
        };

        updateStatus();
        const interval = setInterval(updateStatus, 300000); // Update every 5 minutes

        return () => clearInterval(interval);
    }, []);
    
    return <Box sx={{
        paddingLeft: '0.5em',
        paddingTop: '1em',
    }}>
        <Typography variant="h7">Market Status: {status}</Typography>
    </Box>;
};

export default MarketStatus;