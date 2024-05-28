import { Box, Button, Card, Divider, TextField } from '@mui/material'
import React from 'react'
import { Form } from 'react-router-dom'
import '@/styles/profile.css'
import {TabsDemo} from '@/components/ProfileTabs'


function Profile() {
  // todo: add private details card and money stuff card

  return (
    <div>
      <Divider />
      <div className="heading-text" >
        <h2 style={{ textAlign: 'center', margin: 'auto', cursor: 'pointer', color: '#049985', width:'200px' }} className='underline-effect'>SETTINGS</h2>
      </div>
      <Divider />
     
          <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
          minHeight: '50vh', // Adjust as needed to center vertically within the view
        }}>
          <TabsDemo/>
          </Box>
    </div>
  )
}

export default Profile