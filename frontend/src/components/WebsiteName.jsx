import React from 'react';
import { Typography, Box } from '@mui/material';
import moon from '../../public/FullMoon.png';

const WebsiteName = () => {
  const text = 'MOON MARKET';
  
  const renderTextWithImages = (text) => {
    return text.split('').map((char, index) => {
      if (char === 'O') {
        return (
          <Box
            component="span"
            key={index}
            sx={{
              display: 'inline-block',
              width: '1em', // Adjust the size of the image
              height: '1em',
              backgroundImage: `url(${moon})`,
              backgroundSize: 'cover',
              verticalAlign: 'middle',
              marginLeft: '-0.15em', // Adjust spacing between images
              marginRight:'-0.15em'
            }}
          />
        );
      }
      return <span key={index}>{char}</span>;
    });
  };

  return (
    <Typography variant="h4" sx={{ letterSpacing: '-2px', display: 'flex', alignItems: 'center', justifyContent:'center' }}>
      {renderTextWithImages(text.slice(0, 4))}
      <Box component="span" sx={{ marginLeft: '0.3em' }}>
        {renderTextWithImages(text.slice(4))}
      </Box>
    </Typography>
  );
};

export default WebsiteName;
