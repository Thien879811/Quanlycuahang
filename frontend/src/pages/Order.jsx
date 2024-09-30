import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/order.service';
import { handleResponse } from "../functions/index";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderService.getAll();
                
                const data = handleResponse(response);
                // Sort orders by created_at in descending order (newest first)
                const sortedOrders = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setOrders(sortedOrders);
                console.log(sortedOrders);
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
        const data = handleResponse(response);
        
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
                    Tất cả đơn hàng
                </Typography>
                <Button variant="contained" color="primary" onClick={handleClose}>
                    Đóng
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.tongcong} VND</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                <TableCell>{order.status === '0' ? 'Chưa thanh toán' : 'Đã thanh toán'}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleOpenDialog(order)}>
                                        Xem chi tiết
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <div>
                            <Typography><strong>Mã đơn hàng:</strong> {selectedOrder.id}</Typography>
                            <Typography><strong>Tên khách hàng:</strong> {selectedOrder.customer_name}</Typography>
                            <Typography><strong>Tổng tiền:</strong> {selectedOrder.tongcong}</Typography>
                            <Typography><strong>Ngày:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                            <Typography><strong>Trạng thái:</strong> {selectedOrder.status === '0' ? 'Chưa thanh toán' : 'Đã thanh toán'}</Typography>
                            <Typography><strong>Sản phẩm:</strong></Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên sản phẩm</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            <TableCell>Giá</TableCell>
                                            <TableCell>Thành tiền</TableCell>
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
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Order;
