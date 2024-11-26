import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
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
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(20);
    const [filterStatus, setFilterStatus] = useState('all');
    const [cancelNote, setCancelNote] = useState('');
    const [openCancelNoteDialog, setOpenCancelNoteDialog] = useState(false);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const type = 'today';
            const response = await orderService.getOrder(type);
            const data = handleResponse(response);
            const ordersWithTotal = data.map(order => ({
                ...order,
                total: order.details.reduce((total, product) => {
                    const productTotal = product.discount
                        ? product.soluong * product.dongia - product.discount
                        : product.soluong * product.dongia;
                    return total + productTotal;
                }, 0),
                finalTotal: order.details.reduce((total, product) => {
                    const productTotal = product.discount
                        ? product.soluong * product.dongia - product.discount
                        : product.soluong * product.dongia;
                    return total + productTotal;
                }, 0) * (1 - (order.discount || 0) / 100)
            }));
            const sortedOrders = ordersWithTotal.sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            );
            setOrders(sortedOrders);
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
        setSelectedOrder({ 
            ...order, 
            totalAmount: order.total,
            finalTotal: order.finalTotal
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenCancelDialog = (order) => {
        setOrderToCancel(order);
        setOpenCancelDialog(true);
        setCancelNote('');
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
        setOrderToCancel(null);
        setCancelNote('');
    };

    const handleCancelOrder = async () => {
        if (orderToCancel && cancelNote.trim()) {
            try {
                await orderService.cancel(orderToCancel.id, cancelNote);
                handleCloseCancelDialog();
                handleCloseCancelNoteDialog();
                fetchOrders();
            } catch (error) {
                console.error('Error canceling order:', error);
            }
        } else {
            setOpenCancelNoteDialog(true);
            setOpenCancelDialog(false);
        }
    };

    const handleCancelRequest = async () => {
        if (orderToCancel) {
            try {
                await orderService.cancelRequest(orderToCancel.id);
                handleCloseCancelDialog();
                fetchOrders();
            } catch (error) {
                console.error('Error canceling order:', error);
            }
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
        setPage(0);
    };

    const handleOpenCancelNoteDialog = () => {
        setOpenCancelNoteDialog(true);
    };

    const handleCloseCancelNoteDialog = () => {
        setOpenCancelNoteDialog(false);
        setCancelNote('');
    };

    const getStatusColor = (status) => {
        switch(status) {
            case -1: return { bg: '#ffebee', text: '#d32f2f' };
            case 1: return { bg: '#e8f5e9', text: '#2e7d32' };
            case 2: return { bg: '#e3f2fd', text: '#1976d2' };
            case 3: return { bg: '#fafafa', text: '#757575' };
            case 5: return { bg: '#e8f5e9', text: '#2e7d32' };
            default: return { bg: '#e3f2fd', text: '#1976d2' };
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case -1: return 'Đang yêu cầu hủy';
            case 1: return 'Thanh toán tại quầy';
            case 2: return 'Thanh toán online';
            case 3: return 'Đã hủy';
            case 5: return 'Đơn hàng online';
            default: return 'Không xác định';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'cancelled') {
            return order.status === 3;
        }
        return order.status !== 3 && (
            filterStatus === 'all' ||
            (filterStatus === 'paid' && (order.status === 1 || order.status === 2)) ||
            (filterStatus === 'pending' && order.status === -1) ||
            (filterStatus === 'online' && order.status === 5)
        );
    });

    return (
        <div style={{ padding: '20px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Tất cả đơn hàng
                </Typography>
                <Box display="flex" gap={2}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={handleFilterChange}
                            label="Trạng thái"
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="paid">Đã thanh toán</MenuItem>
                            <MenuItem value="cancelled">Đơn đã hủy</MenuItem>
                            <MenuItem value="pending">Đang yêu cầu hủy</MenuItem>
                            <MenuItem value="online">Đơn hàng online</MenuItem>
                        </Select>
                    </FormControl>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleClose}
                        sx={{ 
                            borderRadius: '8px',
                            textTransform: 'none',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Đóng
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Tổng tiền</TableCell>
                            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Ngày</TableCell>
                            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
                            <TableCell align="right" sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order) => (
                            <TableRow 
                                key={order.id} 
                                sx={{
                                    backgroundColor: order.status === -1 ? '#ffebee' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <TableCell sx={{ color: '#2196f3', fontWeight: 500 }}>
                                    {Math.floor(order.finalTotal).toLocaleString()} VND
                                    {order.discount > 0 && (
                                        <Typography variant="caption" sx={{ color: '#f44336', display: 'block' }}>
                                            Giảm: {order.discount}%
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        backgroundColor: getStatusColor(order.status).bg,
                                        color: getStatusColor(order.status).text
                                    }}>
                                        {getStatusText(order.status)}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Button 
                                        onClick={() => handleOpenDialog(order)} 
                                        variant="contained" 
                                        sx={{
                                            marginRight: '8px',
                                            backgroundColor: '#1976d2',
                                            '&:hover': { backgroundColor: '#1565c0' }
                                        }}
                                    >
                                        Xem
                                    </Button>
                                    {order.status !== 3 && (
                                        <Button 
                                            onClick={() => handleOpenCancelDialog(order)} 
                                            variant="contained" 
                                            color="error"
                                            sx={{
                                                backgroundColor: '#d32f2f',
                                                '&:hover': { backgroundColor: '#c62828' }
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredOrders.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[20]}
                    sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
                />
            </TableContainer>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>
                    Chi tiết đơn hàng
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    {selectedOrder && (
                        <div>
                            <Box sx={{ display: 'grid', gap: 2, marginBottom: 3 }}>
                                <Typography><strong>Mã đơn hàng:</strong> {selectedOrder.id}</Typography>
                                <Typography><strong>Tên khách hàng:</strong> {selectedOrder.customer ? selectedOrder.customer.name : 'Khách lẻ'}</Typography>
                                <Typography><strong>Khuyến mãi:</strong> {selectedOrder.discount  > 0 ? `Giảm ${selectedOrder.discount}%` : 'Không có'}</Typography>
                                <Typography><strong>Tổng tiền:</strong> {Math.floor(selectedOrder.finalTotal).toLocaleString()} VND</Typography>
                                <Typography><strong>Ngày:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                                <Typography><strong>Trạng thái:</strong> 
                                    <span style={{
                                        marginLeft: '8px',
                                        padding: '4px 12px',
                                        borderRadius: '16px',
                                        backgroundColor: getStatusColor(selectedOrder.status).bg,
                                        color: getStatusColor(selectedOrder.status).text
                                    }}>
                                        {getStatusText(selectedOrder.status)}
                                    </span>
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}><strong>Sản phẩm:</strong></Typography>
                            <TableContainer component={Paper} sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Giá</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Giảm giá</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.details && selectedOrder.details.map((product, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{product.product.product_name}</TableCell>
                                                <TableCell>{product.soluong}</TableCell>
                                                <TableCell>{Math.floor(product.dongia).toLocaleString()} VND</TableCell>
                                                <TableCell>{product.discount ? Math.floor(product.discount).toLocaleString() : 0} VND</TableCell>
                                                <TableCell>
                                                    {Math.floor(product.discount ? 
                                                        product.soluong * product.dongia - product.discount : 
                                                        product.soluong * product.dongia).toLocaleString()} VND
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button 
                        onClick={handleCloseDialog} 
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px'
                        }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={openCancelDialog} 
                onClose={handleCloseCancelDialog}
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: '#d32f2f', 
                    color: 'white',
                    padding: '16px 24px'
                }}>
                    {orderToCancel && orderToCancel.status === -1 ? 'Xác nhận hủy yêu cầu' : 'Xác nhận hủy đơn hàng'}
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <Typography>
                        {orderToCancel && orderToCancel.status === -1
                            ? 'Bạn có chắc chắn muốn hủy yêu cầu hủy đơn hàng này không?'
                            : 'Bạn có chắc chắn muốn yêu cầu hủy đơn hàng này không?'}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button 
                        onClick={handleCloseCancelDialog} 
                        variant="outlined"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '8px',
                            marginRight: 1
                        }}
                    >
                        Không
                    </Button>
                    {orderToCancel && orderToCancel.status === -1 ? (
                        <Button 
                            onClick={handleCancelRequest} 
                            variant="contained" 
                            color="error"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px'
                            }}
                        >
                            Có, hủy yêu cầu
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleCancelOrder} 
                            variant="contained" 
                            color="error"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px'
                            }}
                        >
                            Có, yêu cầu hủy đơn hàng
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            <Dialog
                open={openCancelNoteDialog}
                onClose={handleCloseCancelNoteDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle>Nhập lý do hủy đơn hàng</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Lý do hủy" 
                        value={cancelNote} 
                        onChange={(e) => setCancelNote(e.target.value)} 
                        fullWidth 
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelNoteDialog}>Đóng</Button>
                    <Button 
                        onClick={handleCancelOrder}
                        variant="contained" 
                        color="error"
                        disabled={!cancelNote.trim()}
                    >
                        Hủy đơn hàng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Order;
