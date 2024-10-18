import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/order.service';
import { handleResponse } from "../functions/index";
import useOrder from '../utils/orderUtils';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const navigate = useNavigate();
    const { updateOrder } = useOrder();

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAll();
            
            const data = handleResponse(response);
            const sortedOrders = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const ordersWithTotal = sortedOrders.map(order => ({
                ...order,
                total: order.details.reduce((total, product) => {
                    const productTotal = product.discount
                        ? product.soluong * product.dongia - product.discount
                        : product.soluong * product.dongia;
                    return total + productTotal;
                }, 0)
            }));
            setOrders(ordersWithTotal);
            console.log(ordersWithTotal);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleClose = () => {
        navigate('/');
    };

    const handleOpenDialog = async (order) => {
        const response = await orderService.getDetail(order.id);
        const data = handleResponse(response);
        
        setSelectedOrder({ ...data, totalAmount: order.total });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenCancelDialog = (order) => {
        setOrderToCancel(order);
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
        setOrderToCancel(null);
    };

    const handleCancelOrder = async () => {
        if (orderToCancel) {
            await updateOrder(orderToCancel.id, 0, 1);
            handleCloseCancelDialog();
            const updatedOrders = orders.map(order => 
                order.id === orderToCancel.id ? {...order, status: '0'} : order
            );
            fetchOrders();
            setOrders(updatedOrders);
        }
    };

    const handleCancelRequest = async () => {
        if (orderToCancel) {
            await updateOrder(orderToCancel.id, 1 ,1); // Assuming 1 is the status for active orders
            handleCloseCancelDialog();
            // Refresh orders after cancelling the request
            const updatedOrders = orders.map(order => 
                order.id === orderToCancel.id ? {...order, status: '1'} : order
            );
            fetchOrders();
            setOrders(updatedOrders);
        }
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
                            <TableCell align="right">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} style={{ backgroundColor: order.status === 0 ? '#FFCCCB' : 'inherit' }}>
                                <TableCell>{order.total} VND</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    {
                                        order.status === 0 ? 'Đang yêu cầu hủy' :
                                        order.status === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => handleOpenDialog(order)} color="primary" variant="contained" style={{marginRight: '8px'}}>
                                        Xem
                                    </Button>
                                    <Button onClick={() => handleOpenCancelDialog(order)} color="error" variant="contained">
                                        Hủy
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
                            <Typography><strong>Tổng tiền:</strong> {selectedOrder.totalAmount} VND</Typography>
                            <Typography><strong>Ngày:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                            <Typography><strong>Trạng thái:</strong> 
                                {
                                    selectedOrder.status === 0 ?'Đang yêu cầu hủy' :
                                    selectedOrder.status === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'
                                }
                            </Typography>
                            <Typography><strong>Sản phẩm:</strong></Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên sản phẩm</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            <TableCell>Giá</TableCell>
                                            <TableCell>Giảm giá</TableCell>
                                            <TableCell>Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.products && selectedOrder.products.map((product, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                                <TableCell>{product.price}</TableCell>
                                                <TableCell>{product.discount}</TableCell>
                                                <TableCell>{product.discount ? product.quantity * product.price - product.discount : product.quantity * product.price} VND</TableCell>
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

            <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
                <DialogTitle>
                    {orderToCancel && orderToCancel.status === 0 ? 'Xác nhận hủy yêu cầu' : 'Xác nhận hủy đơn hàng'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {orderToCancel && orderToCancel.status === 0
                            ? 'Bạn có chắc chắn muốn hủy yêu cầu hủy đơn hàng này không?'
                            : 'Bạn có chắc chắn muốn yêu cầu hủy đơn hàng này không?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelDialog} color="primary">
                        Không
                    </Button>
                    {orderToCancel && orderToCancel.status === 0 ? (
                        <Button onClick={handleCancelRequest} color="error">
                            Có, hủy yêu cầu
                        </Button>
                    ) : (
                        <Button onClick={handleCancelOrder} color="error">
                            Có, yêu cầu hủy đơn hàng
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Order;
