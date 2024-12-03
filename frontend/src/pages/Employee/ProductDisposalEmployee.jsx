import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    CircularProgress,
    Grid,
    styled
} from '@mui/material';
import productService from '../../services/product.service';
import { handleResponse } from '../../functions';
import dayjs from 'dayjs';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const StyledInput = styled('input')(({ theme }) => ({
    padding: '12px 16px',
    fontSize: '14px',
    marginTop: '13px',
    border: '1px solid #e0e0e0',
    height: '56px',
    borderRadius: '8px',
    width: '100%',
    '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    }
}));

const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid rgba(224, 224, 224, 1)',
    padding: '16px'
});

const StyledChip = styled(Chip)({
    borderRadius: '16px',
    fontWeight: 500,
    '& .MuiChip-icon': {
        fontSize: '20px'
    }
});

const ProductDisposalEmployee = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [disposalRequests, setDisposalRequests] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [destroyDate, setDestroyDate] = useState(dayjs());
    const [expirationDate, setExpirationDate] = useState('');
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState('');
    const [customMonth, setCustomMonth] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            loadProducts();
            loadDisposalRequests();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [timeRange, customDate, customMonth]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getAll();
            const data = handleResponse(response);
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const loadDisposalRequests = async () => {
        try {
            setLoading(true);
            let params = timeRange;
            if (timeRange === 'custom' && customDate) {
                params = customDate;
            } else if (timeRange === 'custom_month' && customMonth) {
                params = customMonth;
            }
            const response = await productService.getDestroyProduct(timeRange, params);
            const data = handleResponse(response);
            setDisposalRequests(data.data);
        } catch (error) {
            console.error('Error loading disposal requests:', error);
            setDisposalRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetForm();
    };

    const resetForm = () => {
        setSelectedProduct('');
        setQuantity('');
        setReason('');
        setDestroyDate(dayjs());
        setExpirationDate('');
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('product_id', selectedProduct);
            formData.append('quantity', quantity);
            formData.append('destroy_date', destroyDate.format('YYYY-MM-DD'));
            formData.append('note', reason);
            formData.append('status', 'pending');
            if (expirationDate) {
                formData.append('expiration_date', expirationDate);
            }

            const response = await productService.createDestroyProduct(formData);
            const data = handleResponse(response);
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating disposal request:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
        if (event.target.value !== 'custom') setCustomDate('');
        if (event.target.value !== 'custom_month') setCustomMonth('');
    };

    const handleCustomDateChange = (event) => {
        setCustomDate(event.target.value);
    };

    const handleCustomMonthChange = (event) => {
        setCustomMonth(event.target.value);
    };

    const getStatusChip = (status) => {
        let color = 'default';
        let icon = <PendingIcon />;
        let label = 'Chờ xử lý';

        switch(status) {
            case 'approved':
                color = 'success';
                icon = <CheckCircleIcon />;
                label = 'Đã duyệt';
                break;
            case 'rejected':
                color = 'error';
                icon = <CancelIcon />;
                label = 'Đã từ chối';
                break;
            case 'pending':
                color = 'warning';
                icon = <PendingIcon />;
                label = 'Chờ xử lý';
                break;
            default:
                break;
        }

        return (
            <StyledChip
                icon={icon}
                label={label}
                color={color}
                size="small"
            />
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                my: 4,
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                backgroundColor: '#f8fafc',
                padding: 3,
                borderRadius: 4,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Quay lại">
                        <IconButton 
                            onClick={() => navigate(-1)}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h4" component="h1" sx={{ 
                        fontWeight: 700,
                        color: '#1e40af',
                        fontSize: { xs: '1.75rem', md: '2rem' },
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        Yêu cầu hủy sản phẩm
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <FormControl size="small" sx={{ minWidth: 200, height: '56px' }}>
                        <InputLabel>Thời gian</InputLabel>
                        <Select
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            label="Thời gian"
                            sx={{ 
                                height: '56px',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            <MenuItem value="today">Hôm nay</MenuItem>
                            <MenuItem value="yesterday">Hôm qua</MenuItem>
                            <MenuItem value="week">Tuần này</MenuItem>
                            <MenuItem value="month">Tháng này</MenuItem>
                            <MenuItem value="custom">Tùy chọn ngày</MenuItem>
                            <MenuItem value="custom_month">Tùy chọn tháng</MenuItem>
                        </Select>
                    </FormControl>
                    {timeRange === 'custom' && (
                        <StyledInput
                            type="date"
                            value={customDate}
                            onChange={handleCustomDateChange}
                            sx={{
                                backgroundColor: 'white',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: '#3b82f6'
                                },
                                width: 200
                            }}
                        />
                    )}
                    {timeRange === 'custom_month' && (
                        <StyledInput
                            type="month"
                            value={customMonth}
                            onChange={handleCustomMonthChange}
                            sx={{
                                backgroundColor: 'white',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: '#3b82f6'
                                },
                                width: 200
                            }}
                        />
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenDialog}
                        sx={{
                            height: '56px',
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            background: 'linear-gradient(45deg, #1e40af 30%, #3b82f6 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1e3a8a 30%, #2563eb 90%)',
                                boxShadow: '0 6px 8px -2px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        Tạo yêu cầu mới
                    </Button>
                </Box>
            </Box>

            <Paper 
                elevation={3} 
                sx={{ 
                    width: '100%', 
                    mb: 4, 
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                    position: 'relative'
                }}
            >
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 1
                    }}>
                        <CircularProgress />
                    </Box>
                )}
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Mã yêu cầu</StyledTableCell>
                                <StyledTableCell>Sản phẩm</StyledTableCell>
                                <StyledTableCell>Số lượng</StyledTableCell>
                                <StyledTableCell>Lý do</StyledTableCell>
                                <StyledTableCell>Ngày tạo</StyledTableCell>
                                <StyledTableCell>Trạng thái</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {disposalRequests.length > 0 && disposalRequests.map((request) => (
                                <TableRow 
                                    key={request.id}
                                    hover
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { 
                                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                                            transition: 'all 0.2s ease-in-out'
                                        }
                                    }}
                                >
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.product?.product_name || 'N/A'}</TableCell>
                                    <TableCell>{request.quantity}</TableCell>
                                    <TableCell sx={{ 
                                        color: '#1e293b', 
                                        maxWidth: 200, 
                                        whiteSpace: 'normal', 
                                        wordBreak: 'break-word',
                                        lineHeight: 1.6,
                                        fontSize: '0.95rem'
                                    }}>
                                        {request.note}
                                    </TableCell>
                                    <TableCell>{dayjs(request.created_at).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{getStatusChip(request.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3 }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    pb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                }}>
                    Tạo yêu cầu hủy sản phẩm
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 3 }}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Sản phẩm</InputLabel>
                            <Select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                label="Sản phẩm"
                                sx={{
                                    borderRadius: '12px',
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                        borderWidth: '2px'
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#3b82f6'
                                    }
                                }}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {product.product_name} ({product.barcode})
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Mã SP: #{product.id}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={`SL: ${product.quantity || 0}`}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Số lượng"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'white'
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Lý do"
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'white'
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Ngày hủy"
                            type="date"
                            value={destroyDate.format('YYYY-MM-DD')}
                            onChange={(e) => setDestroyDate(dayjs(e.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'white'
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Hạn sử dụng (nếu có)"
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: 'white'
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        disabled={submitting}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            mr: 1
                        }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        {submitting ? <CircularProgress size={24} /> : 'Tạo yêu cầu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductDisposalEmployee;
