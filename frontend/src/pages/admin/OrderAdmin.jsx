import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, TablePagination } from '@mui/material';
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

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)',
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0.5),
    borderRadius: '20px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
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
            const dataResponse = handleResponse(response);
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
            const response = await orderService.update(orderId, { status: 3, pays_id: 1 });
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

            const response = await orderService.update(orderId, { status: 3, pays_id: orderToUpdate.pays_id });
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

            const response = await orderService.update(orderId, { status: 1, pays_id: orderToUpdate.pays_id });
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

    const displayedOrders = orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const getStatusColor = (status) => {
        switch(status) {
            case 1: return '#4caf50';
            case 2: return '#2196f3';
            case 3: return '#f44336';
            case -1: return '#ff9800';
            default: return '#757575';
        }
    };

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <StyledCard sx={{ padding: 3, marginBottom: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ReceiptLong color="primary" />
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
                                startAdornment={<FilterList sx={{ mr: 1 }} />}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value={1}>Đã thanh toán tại quầy</MenuItem>
                                <MenuItem value={2}>Đã thanh toán online</MenuItem>
                                <MenuItem value={3}>Đã hủy</MenuItem>
                                <MenuItem value={-1}>Đang yêu cầu hủy</MenuItem>
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
                                startAdornment={<AccessTime sx={{ mr: 1 }} />}
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
                                        borderRadius: '8px',
                                        width: '100%'
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12} md={timeRange === 'custom' ? 1 : 3} container justifyContent="flex-end">
                        <ActionButton 
                            variant="contained" 
                            color="primary" 
                            onClick={handleClose}
                            startIcon={<Close />}
                        >
                            Đóng
                        </ActionButton>
                    </Grid>
                </Grid>
            </StyledCard>

            <StyledCard>
                <TableContainer>
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
                                <TableRow key={order.id} hover>
                                    <TableCell><strong>#{order.id}</strong></TableCell>
                                    <TableCell>{calculateTotal(order.details).toLocaleString()} VND</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {order.pays_id === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'}
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                color: getStatusColor(order.status),
                                                fontWeight: 'bold',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                backgroundColor: `${getStatusColor(order.status)}20`
                                            }}
                                        >
                                            {order.status === -1 ? 'Đơn đang yêu cầu hủy' :
                                             order.status === 0 ? 'Chưa thanh toán' : 
                                             order.status === 1 ? 'Đã thanh toán tại quầy' : 
                                             order.status === 2 ? 'Đã thanh toán online' : 
                                             order.status === 3 ? 'Đã hủy' : 'Không xác định'}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <ActionButton 
                                                variant="outlined" 
                                                onClick={() => handleOpenDialog(order)}
                                                size="small"
                                            >
                                                Xem chi tiết
                                            </ActionButton>
                                            {order.status === 0 && (
                                                <ActionButton 
                                                    variant="outlined" 
                                                    color="error"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    size="small"
                                                >
                                                    Hủy đơn hàng
                                                </ActionButton>
                                            )}
                                            {order.status === -1 && (
                                                <>
                                                    <ActionButton 
                                                        variant="outlined" 
                                                        color="success"
                                                        onClick={() => handleApproveCancel(order.id)}
                                                        size="small"
                                                    >
                                                        Xác nhận hủy
                                                    </ActionButton>
                                                    <ActionButton 
                                                        variant="outlined" 
                                                        color="error"
                                                        onClick={() => handleRejectCancel(order.id)}
                                                        size="small"
                                                    >
                                                        Từ chối hủy
                                                    </ActionButton>
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
            </StyledCard>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        padding: '16px'
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                    <Typography variant="h5" component="div">
                        Chi tiết đơn hàng #{selectedOrder?.id}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedOrder && (
                        <StyledCard>
                            <CardContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ mb: 1 }}><strong>Mã đơn hàng:</strong> #{selectedOrder.id}</Typography>
                                        <Typography sx={{ mb: 1 }}><strong>Tên khách hàng:</strong> {selectedOrder.customer_name}</Typography>
                                        <Typography sx={{ mb: 1 }}><strong>Tổng tiền:</strong> {calculateTotal(selectedOrder.details).toLocaleString()} VND</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography sx={{ mb: 1 }}><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                                        <Typography sx={{ mb: 1 }}><strong>Phương thức thanh toán:</strong> {selectedOrder.pays_id === 1 ? 'Thanh toán tại quầy' : 'Thanh toán online'}</Typography>
                                        <Typography sx={{ mb: 1 }}>
                                            <strong>Trạng thái:</strong>
                                            <Box
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    color: getStatusColor(selectedOrder.status),
                                                    fontWeight: 'bold',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: `${getStatusColor(selectedOrder.status)}20`
                                                }}
                                            >
                                                {selectedOrder.status === -1 ? 'Đơn đang yêu cầu hủy' :
                                                 selectedOrder.status === 0 ? 'Chưa thanh toán' : 
                                                 selectedOrder.status === 1 ? 'Đã thanh toán tại quầy' : 
                                                 selectedOrder.status === 2 ? 'Đã thanh toán online' : 
                                                 selectedOrder.status === 3 ? 'Đã hủy' : 'Không xác định'}
                                            </Box>
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}><strong>Chi tiết sản phẩm</strong></Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Tên sản phẩm</StyledTableCell>
                                                <StyledTableCell align="right">Số lượng</StyledTableCell>
                                                <StyledTableCell align="right">Giá</StyledTableCell>
                                                <StyledTableCell align="right">Giảm giá</StyledTableCell>
                                                <StyledTableCell align="right">Thành tiền</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(selectedOrder.details) ? (
                                                selectedOrder.details.map((detail, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{detail.product.product_name}</TableCell>
                                                        <TableCell align="right">{detail.soluong}</TableCell>
                                                        <TableCell align="right">{detail.dongia?.toLocaleString() || '0'} VND</TableCell>
                                                        <TableCell align="right">{(detail.discount || 0).toLocaleString()} VND</TableCell>
                                                        <TableCell align="right">{((detail.soluong * detail.dongia) - (detail.discount || 0)).toLocaleString()} VND</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow hover>
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
                        </StyledCard>
                    )}
                </DialogContent>
                <DialogActions>
                    <ActionButton onClick={handleCloseDialog} color="primary">
                        Đóng
                    </ActionButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderAdmin;
