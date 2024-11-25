import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import orderService from '../../services/order.service';
import { handleResponse } from '../../functions';
import { styled } from '@mui/material/styles';
import { ReceiptLong, AccessTime, FilterList, Close } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [orderStatus, setOrderStatus] = useState('all');
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
            const response = await orderService.getOrder(type, customDate);
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

            // Filter out cancelled orders (status 3) unless specifically viewing cancelled orders
            let filteredOrders;
            if (orderStatus === 'all') {
                filteredOrders = sortedOrders.filter(order => order.status !== 3);
            } else if (orderStatus === 3) {
                filteredOrders = sortedOrders.filter(order => order.status === 3);
            } else {
                filteredOrders = sortedOrders.filter(order => order.status === orderStatus && order.status !== 3);
            }
            
            setOrders(filteredOrders);
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

    const handleOpenCancelDialog = (order) => {
        setOrderToCancel(order);
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
        setOrderToCancel(null);
    };

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await orderService.cancel(orderId);
            if (response) {
                const updatedOrders = orders.map(order => 
                    order.id === orderId ? { ...order, status: 3, pays_id: order.pays_id } : order
                );
                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
        }
    };

    const handleApproveCancel = async (orderId) => {
        try {
            const orderToUpdate = orders.find(o => o.id === orderId);
            if (!orderToUpdate) return;

            const response = await orderService.acceptCancel(orderId);
            if (response) {
                const updatedOrders = orders.map(order => 
                    order.id === orderId ? { ...order, status: 3 } : order
                );
                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Lỗi khi xác nhận hủy đơn hàng:', error);
        }
    };

    const handleRejectCancel = async (orderId) => {
        try {
            const orderToUpdate = orders.find(o => o.id === orderId);
            if (!orderToUpdate) return;

            const response = await orderService.cancelRequest(orderId);
            if (response) {
                const updatedOrders = orders.map(order => 
                    order.id === orderId ? { ...order, status: 1 } : order
                );
                setOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Lỗi khi từ chối hủy đơn hàng:', error);
        }
    };

    const calculateTotal = (details) => {
        if (Array.isArray(details)) {
            return details.reduce((total, detail) => total + (detail.soluong * detail.dongia - (detail.discount || 0)), 0);
        } else {
            return (details.soluong * detail.dongia - (details.discount || 0));
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

    const displayedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const getStatusColor = (status) => {
        switch(status) {
            case 1: return { bg: '#e8f5e9', text: '#2e7d32' };
            case 2: return { bg: '#e3f2fd', text: '#1976d2' };
            case 3: return { bg: '#fafafa', text: '#757575' };
            case -1: return { bg: '#ffebee', text: '#d32f2f' };
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

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Box sx={{ 
                padding: 3, 
                marginBottom: 3,
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: '#1976d2',
                        fontWeight: 'bold'
                    }}>
                        <ReceiptLong />
                        Đơn hàng
                    </Typography>
                    <Box display="flex" gap={2}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={orderStatus}
                                onChange={handleStatusChange}
                                label="Trạng thái"
                                startAdornment={<FilterList sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value={1}>Đã thanh toán tại quầy</MenuItem>
                                <MenuItem value={2}>Đã thanh toán online</MenuItem>
                                <MenuItem value={3}>Đã hủy</MenuItem>
                                <MenuItem value={-1}>Đang yêu cầu hủy</MenuItem>
                                <MenuItem value={5}>Đơn hàng online</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Thời gian</InputLabel>
                            <Select
                                value={timeRange}
                                onChange={handleTimeRangeChange}
                                label="Thời gian"
                                startAdornment={<AccessTime sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="today">Hôm nay</MenuItem>
                                <MenuItem value="yesterday">Hôm qua</MenuItem>
                                <MenuItem value="week">Tuần này</MenuItem>
                                <MenuItem value="month">Tháng này</MenuItem>
                                <MenuItem value="custom">Tùy chọn</MenuItem>
                            </Select>
                        </FormControl>
                        {timeRange === 'custom' && (
                            <FormControl sx={{ minWidth: 200 }}>
                                <input
                                    type="date"
                                    value={customDate}
                                    onChange={handleCustomDateChange}
                                    style={{
                                        padding: '14px',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        width: '100%'
                                    }}
                                />
                            </FormControl>
                        )}
                        <Button 
                            variant="contained" 
                            onClick={handleClose}
                            startIcon={<Close />}
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
            </Box>

            <TableContainer component={Paper} sx={{ 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                borderRadius: '12px' 
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Mã đơn hàng</StyledTableCell>
                            <StyledTableCell>Tổng tiền</StyledTableCell>
                            <StyledTableCell>Ngày đặt</StyledTableCell>
                            <StyledTableCell>Phương thức thanh toán</StyledTableCell>
                            <StyledTableCell>Trạng thái</StyledTableCell>
                            <StyledTableCell>Thao tác</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedOrders.map((order) => (
                            <TableRow 
                                key={order.id} 
                                sx={{
                                    backgroundColor: order.status === -1 ? '#ffebee' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <TableCell><strong>#{order.id}</strong></TableCell>
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
                                    {order.pays_id === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'}
                                </TableCell>
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
                                    {order.status === -1 && order.note && (
                                        <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', marginTop: 1 }}>
                                            Lý do hủy: {order.note}
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button 
                                            variant="contained"
                                            onClick={() => handleOpenDialog(order)}
                                            sx={{
                                                borderRadius: '8px',
                                                backgroundColor: '#1976d2',
                                                '&:hover': { backgroundColor: '#1565c0' }
                                            }}
                                        >
                                            Xem chi tiết
                                        </Button>
                                        {order.status === 0 && (
                                            <Button 
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleCancelOrder(order.id)}
                                                sx={{
                                                    borderRadius: '8px',
                                                    backgroundColor: '#d32f2f',
                                                    '&:hover': { backgroundColor: '#c62828' }
                                                }}
                                            >
                                                Hủy đơn hàng
                                            </Button>
                                        )}
                                        {order.status === -1 && (
                                            <>
                                                <Button 
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleApproveCancel(order.id)}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        backgroundColor: '#2e7d32',
                                                        '&:hover': { backgroundColor: '#1b5e20' }
                                                    }}
                                                >
                                                    Xác nhận hủy
                                                </Button>
                                                <Button 
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleRejectCancel(order.id)}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        backgroundColor: '#d32f2f',
                                                        '&:hover': { backgroundColor: '#c62828' }
                                                    }}
                                                >
                                                    Từ chối hủy
                                                </Button>
                                            </>
                                        )}
                                    </Box>
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
                    Chi tiết đơn hàng #{selectedOrder?.id}
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    {selectedOrder && (
                        <div>
                            <Box sx={{ display: 'grid', gap: 2, marginBottom: 3 }}>
                                <Typography><strong>Mã đơn hàng:</strong> {selectedOrder.id}</Typography>
                                <Typography><strong>Tên khách hàng:</strong> {selectedOrder.customer ? selectedOrder.customer.customer_name : 'Khách lẻ'}</Typography>
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
                                {selectedOrder.status === -1 && selectedOrder.note && (
                                    <Typography><strong>Lý do hủy:</strong> {selectedOrder.note}</Typography>
                                )}
                            </Box>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}><strong>Chi tiết sản phẩm:</strong></Typography>
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
                                        {Array.isArray(selectedOrder.details) ? (
                                            selectedOrder.details.map((detail, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{detail.product.product_name}</TableCell>
                                                    <TableCell>{detail.soluong}</TableCell>
                                                    <TableCell>{detail.dongia?.toLocaleString() || '0'} VND</TableCell>
                                                    <TableCell>{(detail.discount || 0).toLocaleString()} VND</TableCell>
                                                    <TableCell>{((detail.soluong * detail.dongia) - (detail.discount || 0)).toLocaleString()} VND</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell>{selectedOrder.details?.product_name || ''}</TableCell>
                                                <TableCell>{selectedOrder.details?.soluong || 0}</TableCell>
                                                <TableCell>{selectedOrder.details?.dongia?.toLocaleString() || '0'} VND</TableCell>
                                                <TableCell>{(selectedOrder.details?.discount || 0).toLocaleString()} VND</TableCell>
                                                <TableCell>{calculateTotal(selectedOrder.details).toLocaleString()} VND</TableCell>
                                            </TableRow>
                                        )}
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
        </Box>
    );
};

export default OrderAdmin;
