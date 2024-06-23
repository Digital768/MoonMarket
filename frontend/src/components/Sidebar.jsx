import { Box } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import mainlogo from '../../public/ToTheMoon.png';
import { Link, useLocation } from 'react-router-dom';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import TocSharpIcon from '@mui/icons-material/TocSharp';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import { GraphContext } from '@/pages/ProtectedRoute'

function Sidebar() {
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { setSelectedGraph } = useContext(GraphContext);

    useEffect(() => {
        if (selectedIndex === undefined) {
            setSelectedIndex(0);
        }
    }, [location.pathname]);

    const handleListItemClick = (index, graph) => {
        setSelectedIndex(index);
        setSelectedGraph(graph);
        // console.log("Selected graph:", graph);
    };

    const renderContent = () => {
        if (location.pathname === '/portfolio') {
            return (
                <Box sx={{
                    backgroundColor: '#1d1d1d',
                    width: 70,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Box className="logo1" sx={{
                        paddingTop: '30px',
                    }}>
                        <Link to="/portfolio" className="logo">
                            <img src={mainlogo} style={{ height: '120px', width: '70px' }} />
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
                                        onClick={() => handleListItemClick(0, "Treemap")}
                                    >
                                        <ListItemIcon>
                                            <AutoAwesomeMosaicIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 1}
                                        onClick={() => handleListItemClick(1, "DonutChart")}
                                    >
                                        <ListItemIcon>
                                            <DonutLargeIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 2}
                                        onClick={() => handleListItemClick(2, "Circular")}
                                    >
                                        <ListItemIcon>
                                            <BlurCircularIcon />
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={selectedIndex === 3}
                                        onClick={() => handleListItemClick(3, "TableGraph")}
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
                    width: 70,
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Box className="logo1" sx={{
                        paddingTop: '30px',
                    }}>
                        <Link to="/portfolio" className="logo">
                            <img src={mainlogo} style={{ height: '120px', width: '70px' }} />
                        </Link>
                    </Box>
                </Box>
            );
        }
    };

    return renderContent();
}

export default Sidebar;
