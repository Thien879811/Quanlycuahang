import { Link, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SupportIcon from '@mui/icons-material/Support';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';


export default function DefaultLayout() {
    // const [user, setUser] = useState(() => {
    //     const storedUser = localStorage.getItem('user');
    //     return storedUser ? JSON.parse(storedUser) : {};
    // });
    const {token, setToken} = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to login if no token
    if (!token) {
        return <Navigate to='/login' />;
    }


    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('user');
        setUser({});
        setToken(null);
    };

    return (
        <div id="defaultLayout">
            <div className="content">
                <AppBar position="static" sx={{ backgroundColor: '#0000FF' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle1">
                                {/* {user.name} */}
                            </Typography>
                            <Typography variant="subtitle2">
                                HD : 0001
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton color="inherit" aria-label="support">
                                <SupportIcon />
                                Hỗ Trợ
                            </IconButton>
                            <IconButton color="inherit" aria-label="logout" onClick={()=>handleLogout()}>
                                <ExitToAppIcon />
                                Đăng xuất
                            </IconButton>
                        </Box> 
                    </Toolbar>
                </AppBar>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}