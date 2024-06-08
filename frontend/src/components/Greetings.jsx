import { Box, Divider, Typography } from '@mui/material'
import AccountMenu from '@/components/AccountMenu';
import React from 'react'
import { useState } from 'react';


function Greetings({ username }) {

    const [date,setDate] = useState(new Date());
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Box sx={{
            width: '90%',
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingBottom: '20px'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',

            }}>
                <Box className="Greetings" sx={{
                    padding: 5
                }}>
                    <Typography variant="h4">Hello, {username}</Typography>
                    <Typography color={"#BDBDBD"} variant='subtitle1'>{formattedDate}</Typography>
                </Box>
                <AccountMenu />
            </Box>
            <Divider />
        </Box>
    )
}

export default Greetings