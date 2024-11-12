import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    TablePagination,
    IconButton,
    Tooltip,
    Divider,
    TextField
} from '@mui/material';
import ReceiptService from '../../../services/receipt.service';
import { handleResponse } from '../../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { styled } from '@mui/material/styles';

dayjs.locale('vi');

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(3)
}));

const StyledInput = styled('input')(({ theme }) => ({
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    width: '100%',
    '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    }
}));

const HistoryReceipt = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState('');
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [displayedReceipts, setDisplayedReceipts] = useState([]);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [returnStatus, setReturnStatus] = useState('all');

    useEffect(() => {
        fetchAllReceipts();
    }, [timeRange, customDate]);

    useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setDisplayedReceipts(filteredReceipts.slice(startIndex, endIndex));
    }, [page, rowsPerPage, filteredReceipts]);

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

    const handleReturnStatusChange = (event) => {
        setReturnStatus(event.target.value);
        filterReceipts(event.target.value);
    };

    const filterReceipts = (status) => {
        let filtered = [...receipts];
        
        if (status !== 'all') {
            filtered = receipts.filter(receipt => {
                const hasReturnedItems = receipt.details.some(detail => detail.status === 'Đã trả hàng');
                return status === 'returned' ? hasReturnedItems : !hasReturnedItems;
            });
        }

        setFilteredReceipts(filtered);
        setPage(0);
    };

    const fetchAllReceipts = async () => {
        try {
            const response = await ReceiptService.getReceiptReturn(timeRange, customDate);
            const data = handleResponse(response);
            console.log(data);
            if (data.success) {
                const processedReceipts = data.goods_receipts.map(receipt => ({
                    ...receipt,
                    status: receipt.status === '1' ? 'Đã kiểm tra' : receipt.status,
                    details: receipt.details.map(detail => ({
                        ...detail,
                        status: {
                            '1': 'Đủ hàng hóa',
                            '2': 'Hư hỏng', 
                            '0': 'Thiếu',
                            '4': 'Đã trả hàng'
                        }[detail.status] || detail.status
                    }))
                }));

                setReceipts(processedReceipts);
                filterReceipts(returnStatus);
                setError('');
            } else {
                setError('Không thể tải danh sách phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setError('Đã xảy ra lỗi khi tải danh sách phiếu nhập hàng');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleOpenDetails = (receipt) => {
        setSelectedReceipt(receipt);
        setOpenDetailsDialog(true);
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <StyledCard>
                <CardContent>
                    <Grid container spacing={3} alignItems="center" mb={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                                Chi Tiết Phiếu Nhập Hàng
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Thời gian</InputLabel>
                                <Select
                                    value={timeRange}
                                    onChange={handleTimeRangeChange}
                                    label="Thời gian"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    <MenuItem value="today">Hôm nay</MenuItem>
                                    <MenuItem value="yesterday">Hôm qua</MenuItem>
                                    <MenuItem value="week">Tuần này</MenuItem>
                                    <MenuItem value="month">Tháng này</MenuItem>
                                    <MenuItem value="custom">Tùy chọn</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Trạng thái trả hàng</InputLabel>
                                <Select
                                    value={returnStatus}
                                    onChange={handleReturnStatusChange}
                                    label="Trạng thái trả hàng"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value="returned">Đã trả hàng</MenuItem>
                                    <MenuItem value="not_returned">Chưa trả hàng</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {timeRange === 'custom' && (
                            <Grid item xs={12} md={2}>
                                <StyledInput
                                    type="date"
                                    value={customDate}
                                    onChange={handleCustomDateChange}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} md={timeRange === 'custom' ? 2 : 4} container justifyContent="flex-end">
                            <StyledButton 
                                startIcon={<ArrowBackIcon />}
                                onClick={handleGoBack}
                                variant="contained"
                                size="large"
                            >
                                Quay lại
                            </StyledButton>
                        </Grid>
                    </Grid>

                    {error && (
                        <Typography color="error" sx={{ mb: 2, p: 2, bgcolor: '#ffebee', borderRadius: '8px' }}>
                            {error}
                        </Typography>
                    )}

                    <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Mã phiếu</StyledTableCell>
                                    <StyledTableCell>Ngày nhập</StyledTableCell>
                                    <StyledTableCell>Nhà cung cấp</StyledTableCell>
                                    <StyledTableCell>Thời gian kiểm tra</StyledTableCell>
                                    <StyledTableCell>Trạng thái</StyledTableCell>
                                    <StyledTableCell>Trạng thái trả hàng</StyledTableCell>
                                    <StyledTableCell align="center">Thao tác</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedReceipts.map((receipt) => (
                                    <TableRow 
                                        key={receipt.id}
                                        hover
                                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
                                    >
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                #{receipt.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{new Date(receipt.import_date).toLocaleDateString('vi-VN')}</TableCell>
                                        <TableCell>{receipt.supplier?.factory_name || 'N/A'}</TableCell>
                                        <TableCell>
                                            {receipt.check_date ? 
                                                dayjs(receipt.check_date).format('DD/MM/YYYY HH:mm:ss') : 
                                                <Typography color="text.secondary">Chưa kiểm tra</Typography>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={receipt.status === 'Đã kiểm tra' ? <CheckCircleIcon /> : <WarningIcon />}
                                                label={receipt.status}
                                                color={receipt.status === 'Đã kiểm tra' ? 'success' : 'warning'}
                                                sx={{ borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={receipt.details.some(detail => detail.status === 'Đã trả hàng') ? 'Đã trả hàng' : 'Chưa trả hàng'}
                                                color={receipt.details.some(detail => detail.status === 'Đã trả hàng') ? 'error' : 'default'}
                                                sx={{ borderRadius: '8px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => handleOpenDetails(receipt)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={filteredReceipts.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[50]}
                            sx={{ borderTop: '1px solid #e0e0e0' }}
                        />
                    </TableContainer>
                </CardContent>
            </StyledCard>

            <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết phiếu nhập #{selectedReceipt?.id}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell align="right">Số lượng</TableCell>
                                        <TableCell align="right">Đơn giá</TableCell>
                                        <TableCell align="right">Thành tiền</TableCell>
                                        <TableCell align="right">Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedReceipt?.details?.map((detail) => (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.product?.product_name}</TableCell>
                                            <TableCell align="right">{detail.quantity}</TableCell>
                                            <TableCell align="right">{detail.price?.toLocaleString()} VNĐ</TableCell>
                                            <TableCell align="right">{(detail.quantity * detail.price)?.toLocaleString()} VNĐ</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={detail.status}
                                                    color={detail.status === 'Đã trả hàng' ? 'error' : 'default'}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetailsDialog(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HistoryReceipt;
