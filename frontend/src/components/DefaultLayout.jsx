import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextprovider";
import React from 'react';
import OrderSummary from './OrderSummary';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';
import PaymentComponent from "./Pay";

export default function DefaultLayout() {
    const { user, token } = useStateContext();

    // Redirect to login if no token
    if (!token) {
        return <Navigate to='/login' />;
    }

    // Example order data
    const order = {
        items: [
            { name: 'Item 1', quantity: 2, price: 9.99 },
            { name: 'Item 2', quantity: 1, price: 19.99 },
        ],
        subtotal: 39.97,
        tax: 3.20,
        total: 43.17,
    };

    const handleLogout = () => {
        // Implement your logout logic here
        // For example, clear token and redirect to login page
        localStorage.removeItem('ACCESS_TOKEN');
    };

    return (
        <div id="defaultLayout">
            <div className="content">
                <header>
                    <div>Header</div>
                    <div>
                        <Link to='/home'>Thêm sản phẩm</Link>
                    </div>
                    <div>
                        <Button onClick={handleLogout} variant="outlined" color="error">
                            Logout
                        </Button>
                    </div>
                </header>
                <main>
                    <Outlet />

                    {/* <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2} 
                        justifyContent="center" // Center items horizontally
                // Center items vertically
                        direction="row" >
                            <Grid item xs={9}>
                                <OrderSummary order={order} />
                            </Grid>
                            <Grid item xs={3} container spacing={2}>
                                <Grid item xs={4}>
                                    <Button variant="contained">Tiền Mặt</Button>
                                </Grid>
                                <Grid  item xs={4}>
                                    <Button variant="contained">Online</Button>
                                    <PaymentComponent/>
                                </Grid>
                                <Grid  item xs={4}>
                                    <Button variant="contained">Tích Điểm</Button>
                                    
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box> */}
                </main>
            </div>
        </div>
    );
}
