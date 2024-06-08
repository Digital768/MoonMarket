import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import mainlogo from '../../public/moonMarket_logo.png';
import { Link, useLocation } from 'react-router-dom';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import BarChartIcon from '@mui/icons-material/BarChart';
import TocSharpIcon from '@mui/icons-material/TocSharp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

function Sidebar() {
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (location.pathname === '/portfolio') {
            setSelectedIndex(0);
        }
    }, [location.pathname]);

    const handleListItemClick = (index) => {
        setSelectedIndex(index);
    };

    const renderContent = () => {
        if (location.pathname === '/portfolio') {
            return (
                <Box sx={{
                    backgroundColor: '#1d1d1d',
                    width: 60,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Box className="logo1" sx={{
                        paddingTop: '30px',
                    }}>
                        <Link to="/portfolio" className="logo">
                            <img src={mainlogo} style={{ height: '50px', width: '50px' }} />
                        </Link>
                    </Box>
                    <Box className="Nav-views" sx={{
                        flexGrow: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <nav aria-label="main mailbox folders">
                            <List sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 0}
                                        onClick={() => handleListItemClick(0)}
                                    >
                                        <ListItemIcon>
                                            <AutoAwesomeMosaicIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 1}
                                        onClick={() => handleListItemClick(1)}
                                    >
                                        <ListItemIcon>
                                            <DonutLargeIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 2}
                                        onClick={() => handleListItemClick(2)}
                                    >
                                        <ListItemIcon>
                                            <BarChartIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 3}
                                        onClick={() => handleListItemClick(3)}
                                    >
                                        <ListItemIcon>
                                            <TocSharpIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Box>
                </Box>
            );
        } else {
            return (
                <Box sx={{
                    backgroundColor: '#1d1d1d',
                    width: 60,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Box className="logo1" sx={{
                        paddingTop: '30px',
                    }}>
                        <Link to="/portfolio" className="logo">
                            <img src={mainlogo} style={{ height: '50px', width: '50px' }} />
                        </Link>
                    </Box>
                </Box>
            );
        }
    };

    return renderContent();
}

export default Sidebar;
