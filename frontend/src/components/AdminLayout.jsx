import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography, AppBar, Toolbar, IconButton, CssBaseline, useTheme, TextField, Badge, Menu, MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import GroupIcon from '@mui/icons-material/Group';
import DiscountIcon from '@mui/icons-material/Discount';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export default function AdminLayout() {
    const [admin, setAdmin] = useState('');
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const theme = useTheme();

    if (!token) {
        return <Navigate to='/login' />;
    }

    useEffect(() => {
        if (localStorage.getItem('admin')) {
            setAdmin(JSON.parse(localStorage.getItem('admin')));
        }
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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

    const menuItems = [
        { text: 'Trang chủ', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Người dùng', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Sản phẩm', icon: <InventoryIcon />, path: '/admin/products' },
        { text: 'Nhà cung cấp', icon: <BusinessIcon />, path: '/admin/suppliers' },
        { text: 'Đơn hàng', icon: <AssignmentIcon />, path: '/admin/orders' },
        { text: 'Nhân sự', icon: <GroupIcon />, path: '/admin/staff' },
        { text: 'Khuyến mãi', icon: <DiscountIcon />, path: '/admin/sales' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{
                zIndex: theme.zIndex.drawer + 1,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                ...(open && {
                    marginLeft: drawerWidth,
                    width: `calc(100% - ${drawerWidth}px)`,
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }),
            }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Quản trị
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            placeholder="Tìm kiếm..."
                            variant="outlined"
                            size="small"
                            sx={{ mr: 2, backgroundColor: 'white' }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <AccountCircleIcon />
                        </IconButton>
                        <Typography variant="subtitle1" sx={{ ml: 1, color: 'white' }}>
                            {admin ? admin.name : 'Admin'}
                        </Typography>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/profile'); }}>Hồ sơ</MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Đăng xuất</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        whiteSpace: 'nowrap',
                        ...(open ? openedMixin(theme) : closedMixin(theme)),
                    },
                }}
                variant="permanent"
                open={open}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <List>
                    <ListItem button onClick={() => navigate('/admin/settings')}>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Cài đặt" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                        <ListItemText primary="Đăng xuất" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}