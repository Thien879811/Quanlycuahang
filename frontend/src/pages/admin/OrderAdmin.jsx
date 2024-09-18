import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/order.service';

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
                console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleClose = () => {
        navigate('/admin');
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

    const handleCancelOrder = async (orderId) => {
        try {
            await orderService.cancelOrder(orderId);
            // Cập nhật lại danh sách đơn hàng sau khi hủy
            const updatedOrders = orders.map(order => 
                order.id === orderId ? { ...order, status: 'Đã hủy' } : order
            );
            setOrders(updatedOrders);
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
        }
    };

    return (
        <Box>
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
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
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
                                        Xem chi tiết
                                    </Button>
                                    {order.status === '0' && (
                                        <Button variant="outlined" color="secondary" onClick={() => handleCancelOrder(order.id)}>
                                            Hủy đơn hàng
                                        </Button>
                                    )}
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
                            <Typography><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
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
        </Box>
    );
};

export default Order;
