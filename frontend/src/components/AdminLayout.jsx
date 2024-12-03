import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, AppBar, Toolbar, IconButton, CssBaseline, useTheme, TextField, Badge, Menu, MenuItem, Collapse, Snackbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';;
import LogoutIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import DiscountIcon from '@mui/icons-material/Discount';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Pusher from 'pusher-js';

const drawerWidth = 240;

export default function AdminLayout() {
    const [admin, setAdmin] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const { token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const [openProducts, setOpenProducts] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [pusherClient, setPusherClient] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('admin')) {
            setAdmin(JSON.parse(localStorage.getItem('admin')));
        }
        
        // Initialize Pusher
        const pusher = new Pusher('6019c42b39af742e2bf2', {
            cluster: 'ap1',
        });
        setPusherClient(pusher);

        const channel = pusher.subscribe('employee-leave');
        channel.bind('leave-request', function(data) {
            console.log(data);
            const { staff_id, date, reason } = data;
            setNotificationMessage(`Nhân viên ${staff_id} xin nghỉ phép ngày ${date}. Lý do: ${reason}`);
            setOpenNotification(true);
        });

        return () => {
            if (pusherClient) {
                pusherClient.unsubscribe('employee-leave');
                pusherClient.disconnect();
            }
        };
    }, []);

    if (!token) {
        return <Navigate to='/login' />;
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        if (pusherClient) {
            pusherClient.unsubscribe('employee-leave');
            pusherClient.disconnect();
        }
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('user');
        localStorage.removeItem('admin');
        setUser({});
        setToken(null);
        navigate('/login');
    };

    const handleProductsClick = () => {
        setOpenProducts(!openProducts);
    };

    const handleCloseNotification = () => {
        setOpenNotification(false);
    };

    const menuItems = [
        { text: 'Trang chủ', icon: <DashboardIcon sx={{color: '#fff'}} />, path: '/admin' },
        { text: 'Nhà cung cấp', icon: <BusinessIcon sx={{color: '#fff'}} />, path: '/admin/suppliers' },
        {
            text: 'Sản phẩm',
            icon: <InventoryIcon sx={{color: '#fff'}} />,
            onClick: handleProductsClick,
            open: openProducts,
            subItems: [
                { text: 'Tổng quan tồn kho', path: '/admin/products' },
                { text: 'Báo cáo kiểm kho', icon: <HistoryIcon sx={{color: '#fff'}} />, path: '/admin/inventory-report' },
                { text: 'Nhập kho', icon: <AddShoppingCartIcon sx={{color: '#fff'}} />, path: '/admin/import-product' },
                { text: 'Hủy sản phẩm', icon: <DeleteSweepIcon sx={{color: '#fff'}} />, path: '/admin/product-disposal' },
            ],
        },
        { text: 'Khách hàng', icon: <PeopleIcon sx={{color: '#fff'}} />, path: '/admin/customers' },
        { text: 'Đơn hàng', icon: <AssignmentIcon sx={{color: '#fff'}} />, path: '/admin/orders' },
        { text: 'Khuyến mãi', icon: <DiscountIcon sx={{color: '#fff'}} />, path: '/admin/sales' },
        { text: 'Người dùng', icon: <PersonIcon sx={{color: '#fff'}} />, path: '/admin/users' },
        { text: 'Nhân sự', icon: <AssignmentIndIcon sx={{color: '#fff'}} />, path: '/admin/staff' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{
                zIndex: theme.zIndex.drawer + 1,
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                backgroundColor: '#1976d2',
            }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Hệ thống Quản trị
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Typography variant="subtitle1" sx={{ ml: 1, color: 'white', fontWeight: 'medium' }}>
                            {admin ? admin.name : 'Admin'}
                        </Typography>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Đăng xuất</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
                <Snackbar
                open={openNotification}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notificationMessage}
            />
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item, index) => (
                            <React.Fragment key={item.text}>
                                <ListItem
                                    button
                                    onClick={item.onClick || (() => navigate(item.path))}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#34495e',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: '#3498db',
                                        },
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                    {item.subItems && (item.open ? <ExpandLess sx={{color: '#fff'}} /> : <ExpandMore sx={{color: '#fff'}} />)}
                                </ListItem>
                                {item.subItems && (
                                    <Collapse in={item.open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.subItems.map((subItem, subIndex) => (
                                                <ListItem
                                                    button
                                                    key={subItem.text}
                                                    onClick={() => navigate(subItem.path)}
                                                    sx={{
                                                        pl: 4,
                                                        '&:hover': {
                                                            backgroundColor: '#34495e',
                                                        },
                                                    }}
                                                >
                                                    <ListItemText primary={subItem.text} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                    <Divider sx={{ backgroundColor: '#34495e' }} />
                    <List>
                        <ListItem button onClick={handleLogout} sx={{
                            '&:hover': {
                                backgroundColor: '#34495e',
                            },
                        }}>
                            <ListItemIcon><LogoutIcon sx={{color: '#fff'}} /></ListItemIcon>
                            <ListItemText primary="Đăng xuất" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#ecf0f1' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}