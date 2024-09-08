import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/order.service';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderService.getAll();
                console.log(response);
                const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
                const data = JSON.parse(cleanJsonString);
                setOrders(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleClose = () => {
        navigate('/');
    };

    const handleOpenDialog = async (order) => {

        const response = await orderService.getDetail(order.id);
        const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
        const data = JSON.parse(cleanJsonString);
        
        console.log(data);
        setSelectedOrder(data);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">
                    All Orders
                </Typography>
                <Button variant="contained" color="primary" onClick={handleClose}>
                    Close
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Total Amount</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.tongcong} VND</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                <TableCell>{order.status === '0' ? 'Chưa thanh toán' : 'Đã thanh toán'}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleOpenDialog(order)}>
                                        View Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Order Details</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <div>
                            <Typography><strong>Order ID:</strong> {selectedOrder.id}</Typography>
                            <Typography><strong>Customer Name:</strong> {selectedOrder.customer_name}</Typography>
                            <Typography><strong>Total Amount:</strong> {selectedOrder.tongcong}</Typography>
                            <Typography><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                            <Typography><strong>Status:</strong> {selectedOrder.status === '0' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Typography>
                            <Typography><strong>Products:</strong></Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.products && selectedOrder.products.map((product, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                                <TableCell>{product.price}</TableCell>
                                                <TableCell>{product.quantity * product.price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Order;
