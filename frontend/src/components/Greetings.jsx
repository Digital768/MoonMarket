import { Box, Divider } from '@mui/material'
import AccountMenu from '@/components/AccountMenu';
import React from 'react'

function Greetings() {
    return (
        <Box sx={{
            width: '90%',
            marginRight:'auto',
            marginLeft:'auto',
            paddingBottom:'20px'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',

            }}>
                <Box className="Greetings" sx={{
                    padding: 5
                }}>
                    <h1>Hello, Ben</h1>
                    <h4>Saturday, June 8    </h4>
                </Box>
                <AccountMenu />
            </Box>
            <Divider />
        </Box>
    )
}

export default Greetings