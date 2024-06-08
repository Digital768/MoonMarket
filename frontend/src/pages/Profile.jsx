import { Box, Button, Card, Divider, TextField } from '@mui/material'
import React, { useEffect } from 'react'
import '@/styles/profile.css'
import { TabsDemo } from '@/components/ProfileTabs'
import { useLoaderData } from "react-router-dom";
import {getUserName} from '@/api/user'
import { getUserData } from '@/api/user'


export const loader = (token) => async () => {
  const response = await getUserData(token)
  const user = response.data
  const username = user.username
  const current_balance = user.current_balance
  return {username, current_balance}
}

function Profile() {
  // todo: add private details card and money stuff card
  const data = useLoaderData();
  const username = data.username
  const current_balance = data.current_balance

  // useEffect(() => {console.log(data);},[data])
  
  return (
    <div>
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
        <TabsDemo username={username} current_balance={current_balance} />
      </Box>
    </div>
  )
}

export default Profile