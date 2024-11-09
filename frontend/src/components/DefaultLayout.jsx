import { Link, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function DefaultLayout() {
    const [employee, setEmployee] = useState('');
            
    const {token, setToken, user, setUser} = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();

    if (!token) {
        return <Navigate to='/login' />;
    }

    useEffect(() => {
        if (localStorage.getItem('employee')) {
            setEmployee(JSON.parse(localStorage.getItem('employee')));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('user');
        localStorage.removeItem('employee');
        setUser({});
        setToken(null);
        setEmployee('');
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {employee.names || 'Nhân viên'}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ backgroundColor: '#2196f3', padding: '4px 12px', borderRadius: '16px' }}>
                            HD: 0001
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            color="inherit" 
                            onClick={() => navigate('/warehouse')}
                            sx={{ 
                                borderRadius: '8px',
                                padding: '8px 16px',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                            }}
                        >
                            <InventoryIcon sx={{ mr: 1 }} />
                            <Typography variant="button">Quản lý kho</Typography>
                        </IconButton>
                        
                        <IconButton 
                            color="inherit" 
                            onClick={handleLogout}
                            sx={{ 
                                borderRadius: '8px',
                                padding: '8px 16px',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                            }}
                        >
                            <ExitToAppIcon sx={{ mr: 1 }} />
                            <Typography variant="button">Đăng xuất</Typography>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            
            <main style={{ flex: 1, padding: '1rem' }}>
                <Outlet />
            </main>
        </div>
    );
}