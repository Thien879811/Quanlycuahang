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
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pusher from 'pusher-js';

export default function DefaultLayout() {
    const [employee, setEmployee] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationElements, setNotificationElements] = useState([]);
            
    const {token, setToken, user, setUser, userRole} = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();

  
    if (!token) {
        return <Navigate to='/login' />;
    }

    if (userRole === 'admin') {
        return <Navigate to='/admin' />;
    }

    useEffect(() => {
        const pusher = new Pusher('0c950e03dbbbdc232428', {
            cluster: 'ap1',
        });
        
        const channel = pusher.subscribe('notifications');
        channel.bind('App\\Events\\NewNotification', (data) => {
            if (data.message) {
                setNotifications(prev => [...prev, data]);
                
                // Create notification element
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #4CAF50, #2196F3);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                    z-index: 1000;
                    min-width: 300px;
                    animation: slideIn 0.5s ease-out;
                `;
                
                // Add notification content
                notification.innerHTML = `
                    <div style="position: relative;">
                        <button style="
                            position: absolute;
                            top: -10px;
                            right: -10px;
                            background: rgba(255,255,255,0.3);
                            border: none;
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            color: white;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                            transition: all 0.2s;
                        " onclick="this.parentElement.parentElement.remove()">✕</button>
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <div style="background: rgba(255,255,255,0.2); border-radius: 50%; padding: 8px; margin-right: 12px;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                                </svg>
                            </div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Đơn hàng mới</h3>
                        </div>
                        <p style="margin: 0 0 8px 0; font-size: 15px;">${data.message}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 500;">Tổng tiền: ${data.total ? data.total.toLocaleString('vi-VN') : 0} đ</span>
                            <button style="
                                background: rgba(255,255,255,0.2);
                                border: none;
                                padding: 6px 12px;
                                border-radius: 6px;
                                color: white;
                                cursor: pointer;
                                font-size: 13px;
                            " onclick="window.location.href='/orders'">Chi tiết</button>
                        </div>
                    </div>
                `;

                // Add animation keyframes
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);

                // Add to document
                document.body.appendChild(notification);
                
                // Add to state array
                setNotificationElements(prev => [...prev, notification]);

                // Remove after 5 seconds with fade out animation
                setTimeout(() => {
                    notification.style.animation = 'fadeOut 0.5s ease-out';
                    notification.addEventListener('animationend', () => {
                        notification.remove();
                        setNotificationElements(prev => prev.filter(el => el !== notification));
                    });
                }, 5000);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, []);

    useEffect(() => {
        const savedEmployee = localStorage.getItem('employee');
        if (savedEmployee) {
            try {
                setEmployee(JSON.parse(savedEmployee));
            } catch (error) {
                console.error('Error parsing employee data:', error);
                localStorage.removeItem('employee');
            }
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

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const clearNotifications = () => {
        setNotifications([]);
        handleNotificationClose();
        // Remove all notification elements with animation
        notificationElements.forEach(element => {
            element.style.animation = 'fadeOut 0.5s ease-out';
            element.addEventListener('animationend', () => {
                element.remove();
            });
        });
        setNotificationElements([]);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ 
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 2rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            {employee?.names || 'Nhân viên'}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ 
                            background: 'rgba(255,255,255,0.15)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)'
                        }}>
                            HD: 0001
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            color="inherit"
                            onClick={handleNotificationClick}
                            sx={{
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <Badge 
                                badgeContent={notifications.length} 
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        background: '#ff4444',
                                        fontWeight: '600'
                                    }
                                }}
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleNotificationClose}
                            PaperProps={{
                                style: {
                                    maxHeight: 400,
                                    width: '350px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                },
                            }}
                        >
                            {notifications.length > 0 ? (
                                <>
                                    {notifications.map((notification, index) => (
                                        <MenuItem key={index} sx={{
                                            padding: '12px 20px',
                                            borderBottom: index !== notifications.length - 1 ? '1px solid #eee' : 'none',
                                            '&:hover': {
                                                background: '#f5f5f5'
                                            }
                                        }}>
                                            <div>
                                                <Typography variant="subtitle2" sx={{ fontWeight: '500', marginBottom: '4px' }}>
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    Tổng tiền: {notification.total ? notification.total.toLocaleString('vi-VN') : '0'} đ
                                                </Typography>
                                            </div>
                                        </MenuItem>
                                    ))}
                                    <MenuItem 
                                        onClick={() => {
                                            handleNotificationClose();
                                            navigate('/orders');
                                        }}
                                        sx={{
                                            justifyContent: 'center',
                                            borderTop: '1px solid #eee',
                                            padding: '12px'
                                        }}
                                    >
                                        <Typography sx={{ 
                                            color: '#1976d2',
                                            fontWeight: '500',
                                            fontSize: '14px'
                                        }}>
                                            Xem tất cả đơn hàng
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={clearNotifications}
                                        sx={{
                                            justifyContent: 'center',
                                            borderTop: '1px solid #eee',
                                            padding: '12px'
                                        }}
                                    >
                                        <Typography sx={{ 
                                            color: '#1976d2',
                                            fontWeight: '500',
                                            fontSize: '14px'
                                        }}>
                                            Xóa tất cả thông báo
                                        </Typography>
                                    </MenuItem>
                                </>
                            ) : (
                                <MenuItem sx={{ justifyContent: 'center', padding: '20px' }}>
                                    <Typography sx={{ color: '#666' }}>Không có thông báo</Typography>
                                </MenuItem>
                            )}
                        </Menu>

                        <IconButton 
                            color="inherit" 
                            onClick={() => navigate('/warehouse')}
                            sx={{ 
                                borderRadius: '10px',
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s',
                                '&:hover': { 
                                    background: 'rgba(255,255,255,0.2)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <InventoryIcon sx={{ mr: 1 }} />
                            <Typography variant="button" sx={{ fontWeight: '500' }}>
                                Quản lý kho
                            </Typography>
                        </IconButton>
                        
                        <IconButton 
                            color="inherit" 
                            onClick={handleLogout}
                            sx={{ 
                                borderRadius: '10px',
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s',
                                '&:hover': { 
                                    background: 'rgba(255,255,255,0.2)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <ExitToAppIcon sx={{ mr: 1 }} />
                            <Typography variant="button" sx={{ fontWeight: '500' }}>
                                Đăng xuất
                            </Typography>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            
            <main style={{ 
                flex: 1, 
                padding: '2rem',
                background: '#f5f7fa'
            }}>
                <Outlet />
            </main>
        </div>
    );
}