import { Box, Button, Card, Divider, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import '@/styles/profile.css'
import { TabsDemo } from '@/components/ProfileTabs'
import { useLoaderData } from "react-router-dom";




function Profile() {
  // todo: add private details card and money stuff card
  const data = useLoaderData();
  const username = data.data;
  
  return (
    <div>
      <Divider />
      <div className="heading-text" >
        <h2 style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer', color: '#049985', width: '200px' }} className='underline-effect'>ACCOUNT</h2>
      </div>
      <Divider />

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        minHeight: '50vh', // Adjust as needed to center vertically within the view
      }}>
        <TabsDemo username={username} />
      </Box>
    </div>
  )
}

export default Profile