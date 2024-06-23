import { Box, Divider, Typography } from '@mui/material'
import AccountMenu from '@/components/AccountMenu';
import React from 'react'
import { useState } from 'react';
import SearchBar from "@/components/SearchBar.jsx";


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
                alignItems:'center',

            }}>
                <Box className="Greetings" sx={{
                    padding: 5
                }}>
                    <Typography variant="h4">Hello, {username}</Typography>
                    <Typography color={"#BDBDBD"} variant='subtitle1'>{formattedDate}</Typography>
                </Box>
                <Box sx={{
                    marginRight:'11em'
                }}>
                <SearchBar />
                </Box>
                <AccountMenu />
            </Box>
            <Divider />
        </Box>
    )
}

export default Greetings