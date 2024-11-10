import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, AppBar, Toolbar, IconButton, CssBaseline, useTheme, TextField, Badge, Menu, MenuItem, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import DiscountIcon from '@mui/icons-material/Discount';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 240;

export default function AdminLayout() {
    const [admin, setAdmin] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const { token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const [openProducts, setOpenProducts] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('admin')) {
            setAdmin(JSON.parse(localStorage.getItem('admin')));
        }
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

    const menuItems = [
        { text: 'Trang chủ', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Người dùng', icon: <PeopleIcon />, path: '/admin/users' },
        {
            text: 'Sản phẩm',
            icon: <InventoryIcon />,
            onClick: handleProductsClick,
            open: openProducts,
            subItems: [
                { text: 'Tổng quan tồn kho', path: '/admin/products' },
                { text: 'Báo cáo kiểm kho', icon: <HistoryIcon />, path: '/admin/inventory-report' },
                { text: 'Nhập hàng', icon: <AddShoppingCartIcon />, path: '/admin/import-product' },
                { text: 'Kiểm hàng', icon: <FactCheckIcon />, path: '/admin/inventory-check' },
                { text: 'Hủy sản phẩm', icon: <DeleteSweepIcon />, path: '/admin/product-disposal' },
                { text: 'Lịch sử nhập', icon: <HistoryIcon />, path: '/admin/import-history' },
            ],
        },
        { text: 'Khách hàng', icon: <PeopleIcon />, path: '/admin/customers' },
        { text: 'Nhà cung cấp', icon: <BusinessIcon />, path: '/admin/suppliers' },
        { text: 'Đơn hàng', icon: <AssignmentIcon />, path: '/admin/orders' },
        { text: 'Nhân sự', icon: <GroupIcon />, path: '/admin/staff' },
        { text: 'Khuyến mãi', icon: <DiscountIcon />, path: '/admin/sales' },
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
                                    <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                    {item.subItems && (item.open ? <ExpandLess /> : <ExpandMore />)}
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
                            <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
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