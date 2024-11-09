import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/order.service';
import { handleResponse } from '../../functions';

const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [orderStatus, setOrderStatus] = useState('all'); // Changed from string to number
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [orderStatus, timeRange, customDate]);

    const fetchOrders = async () => {
        try {
            let type = timeRange;
            if (timeRange === 'custom' && customDate) {
                type = 'custom';
            }
            const response = await orderService.getOrder(type,customDate);
            const dataResponse = handleResponse(response);
            console.log(dataResponse);
            if (orderStatus === 'all') {
                setOrders(dataResponse);
            } else {
                setOrders(dataResponse.filter(order => order.status === orderStatus));
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
    };

    const handleClose = () => {
        navigate('/admin');
    };

    const handleOpenDialog = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await orderService.update(orderId, { status: 3, pays_id: 1 }); // Added pays_id
            if (response) {
                const updatedOrders = orders.map(order => 
                    order.id === orderId ? { ...order, status: 3 } : order
                );
                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
        }
    };

    const calculateTotal = (details) => {
        if (Array.isArray(details)) {
            return details.reduce((total, detail) => total + (detail.soluong * detail.dongia - (detail.discount || 0)), 0);
        } else {
            return (details.soluong * details.dongia - (details.discount || 0));
        }
    };

    const handleStatusChange = (event) => {
        setOrderStatus(event.target.value);
        setPage(0);
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
        setPage(0);
    };

    const handleCustomDateChange = (event) => {
        setCustomDate(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Calculate the slice of orders to display
    const displayedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3} alignItems="center" mb={3}>
                <Grid item xs={12} md={3}>
                    <Typography variant="h4" gutterBottom>
                        Đơn hàng
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={orderStatus}
                            onChange={handleStatusChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value={1}>Đã thanh toán tại quầy</MenuItem>
                            <MenuItem value={2}>Đã thanh toán online</MenuItem>
                            <MenuItem value={3}>Đã hủy</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Thời gian</InputLabel>
                        <Select
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            label="Thời gian"
                        >
                            <MenuItem value="today">Hôm nay</MenuItem>
                            <MenuItem value="yesterday">Hôm qua</MenuItem>
                            <MenuItem value="week">Tuần này</MenuItem>
                            <MenuItem value="month">Tháng này</MenuItem>
                            <MenuItem value="custom">Tùy chọn</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {timeRange === 'custom' && (
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <input
                                type="date"
                                value={customDate}
                                onChange={handleCustomDateChange}
                                style={{
                                    padding: '14px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    width: '100%'
                                }}
                            />
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12} md={timeRange === 'custom' ? 1 : 3} container justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn hàng</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell>Phương thức thanh toán</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{calculateTotal(order.details).toLocaleString()} VND</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    {order.pays_id === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'}
                                </TableCell>
                                <TableCell>
                                    {order.status === 0 ? 'Chưa thanh toán' : 
                                     order.status === 1 ? 'Đã thanh toán tại quầy' : 
                                     order.status === 2 ? 'Đã thanh toán online' : 
                                     order.status === 3 ? 'Đã hủy' : 'Không xác định'}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleOpenDialog(order)} sx={{ mr: 1 }}>
                                        Xem chi tiết
                                    </Button>
                                    {order.status === 0 && (
                                        <Button variant="outlined" color="secondary" onClick={() => handleCancelOrder(order.id)}>
                                            Hủy đơn hàng
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={orders.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[50]}
                />
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedOrder && (
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography><strong>Mã đơn hàng:</strong> {selectedOrder.id}</Typography>
                                        <Typography><strong>Tên khách hàng:</strong> {selectedOrder.customer_name}</Typography>
                                        <Typography><strong>Tổng tiền:</strong> {calculateTotal(selectedOrder.details).toLocaleString()} VND</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                                        <Typography><strong>Phương thức thanh toán:</strong> {selectedOrder.pays_id === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'}</Typography>
                                        <Typography><strong>Trạng thái:</strong> {
                                            selectedOrder.status === 0 ? 'Chưa thanh toán' : 
                                            selectedOrder.status === 1 ? 'Đã thanh toán tại quầy' : 
                                            selectedOrder.status === 2 ? 'Đã thanh toán online' : 
                                            selectedOrder.status === 3 ? 'Đã hủy' : 'Không xác định'
                                        }</Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}><strong>Sản phẩm:</strong></Typography>
                                <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Tên sản phẩm</TableCell>
                                                <TableCell align="right">Số lượng</TableCell>
                                                <TableCell align="right">Giá</TableCell>
                                                <TableCell align="right">Giảm giá</TableCell>
                                                <TableCell align="right">Thành tiền</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(selectedOrder.details) ? (
                                                selectedOrder.details.map((detail, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{detail.product.product_name}</TableCell>
                                                        <TableCell align="right">{detail.soluong}</TableCell>
                                                        <TableCell align="right">{detail.dongia?.toLocaleString() || '0'} VND</TableCell>
                                                        <TableCell align="right">{(detail.discount || 0).toLocaleString()} VND</TableCell>
                                                        <TableCell align="right">{((detail.soluong * detail.dongia) - (detail.discount || 0)).toLocaleString()} VND</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell>{selectedOrder.details?.product_name || ''}</TableCell>
                                                    <TableCell align="right">{selectedOrder.details?.soluong || 0}</TableCell>
                                                    <TableCell align="right">{selectedOrder.details?.dongia?.toLocaleString() || '0'} VND</TableCell>
                                                    <TableCell align="right">{(selectedOrder.details?.discount || 0).toLocaleString()} VND</TableCell>
                                                    <TableCell align="right">{calculateTotal(selectedOrder.details).toLocaleString()} VND</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
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

export default OrderAdmin;
