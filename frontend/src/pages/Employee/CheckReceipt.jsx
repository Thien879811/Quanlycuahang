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
    Divider
} from '@mui/material';
import ReceiptService from '../../services/receipt.service';
import { handleResponse } from '../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
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

const ReceiptCheck = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState('');
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(50);
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [displayedReceipts, setDisplayedReceipts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [checkResults, setCheckResults] = useState({});
    const [checkTime, setCheckTime] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDisposed, setShowDisposed] = useState(false);

    useEffect(() => {
        fetchAllReceipts();
    }, []);

    useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        let filtered = filteredReceipts;
        if (!showDisposed) {
            filtered = filteredReceipts.filter(receipt => 
                !receipt.details.some(detail => detail.status === 'Hư hỏng')
            );
        }
        setDisplayedReceipts(filtered.slice(startIndex, endIndex));
    }, [page, rowsPerPage, filteredReceipts, showDisposed]);

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const handleCustomDateChange = (event) => {
        setCustomDate(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const toggleShowDisposed = () => {
        setShowDisposed(!showDisposed);
    };

    const fetchAllReceipts = async () => {
        try {
            const response = await ReceiptService.getReceipt(timeRange, customDate);
            const data = handleResponse(response);
            console.log(data);
            if (data.success) {
                data.goods_receipts.forEach(receipt => {
                    if (receipt.status === '1') {
                        receipt.status = 'Đã kiểm tra';
                    } else {
                        receipt.status = 'Chưa kiểm tra';
                    }
                    receipt.details.forEach(detail => {
                        if (detail.status === '1') {
                            detail.status = 'Đủ hàng hóa';
                        }
                        if (detail.status === '2') {
                            detail.status = 'Hư hỏng';
                        }
                        if (detail.status === '3') {
                            detail.status = 'Thiếu';
                        }
                        if (detail.status === '4') {
                            detail.status = 'Đã hủy';
                        }
                    });
                });
                setReceipts(data.goods_receipts);
                setFilteredReceipts(data.goods_receipts);
                setError('');
            } else {
                setError('Không thể tải danh sách phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setError('Đã xảy ra lỗi khi tải danh sách phiếu nhập hàng');
        }
    };

    const handleSearch = () => {
        const filtered = receipts.filter(receipt => 
            receipt.id.toString().includes(searchTerm) ||
            receipt.supplier?.factory_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receipt.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReceipts(filtered);
    };

    const handleOpenCheckDialog = (receipt) => {
        // Filter out products with status '4' (Đã hủy)
        const filteredDetails = receipt.details.filter(detail => detail.status !== 'Đã hủy');
        const filteredReceipt = {...receipt, details: filteredDetails};
        
        setSelectedReceipt(filteredReceipt);
        setCheckResults({});
        setCheckTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
        filteredDetails.forEach(detail => {
            if (detail.status === '0' || detail.status === 'Chưa kiểm tra') {
                setCheckResults(prev => ({
                    ...prev,
                    [detail.id]: { 
                        status: '1', 
                        note: '',
                        production_date: null,
                        expiration_date: null,
                        quantity_receipt: detail.quantity
                    }
                }));
            }
        });
        setOpenDialog(true);
        setCheckTime(dayjs().format('DD/MM/YYYY HH:mm:ss'));
    };

    const handleCloseCheckDialog = () => {
        setOpenDialog(false);
        setSelectedReceipt(null);
        setCheckResults({});
    };

    const handleCheckResultChange = (detailId, field, value) => {
        setCheckResults(prev => {
            const updatedResult = {
                ...prev,
                [detailId]: { ...prev[detailId], [field]: value }
            };

            if (field === 'quantity_receipt') {
                const detail = selectedReceipt.details.find(d => d.id === detailId);
                if (detail && Number(value) !== detail.quantity) {
                    updatedResult[detailId].status = '0';
                }
            }

            return updatedResult;
        });
    };

    const handleSubmitCheck = async () => {
        try {
            const updatedReceipt = {
                ...selectedReceipt,
                status: '1',
                check_date: checkTime,
                details: selectedReceipt.details.map(detail => ({
                    ...detail,
                    status: checkResults[detail.id]?.status || detail.status,
                    note: checkResults[detail.id]?.note || detail.note,
                    production_date: checkResults[detail.id]?.production_date || detail.production_date,
                    expiration_date: checkResults[detail.id]?.expiration_date || detail.expiration_date,
                    quantity_receipt: checkResults[detail.id]?.quantity_receipt || detail.quantity_receipt
                }))
            };

            setReceipts(receipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));
            setFilteredReceipts(filteredReceipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));

            console.log(updatedReceipt);

            const response = await ReceiptService.update(updatedReceipt.id, updatedReceipt);
            const data = handleResponse(response);
            if (data.success) {
                console.log(data);
                setError('');
            } else {
                setError('Không thể cập nhật phiếu nhập hàng');
            }
            handleCloseCheckDialog();
            fetchAllReceipts();
        } catch (error) {
            console.error('Error updating receipt:', error);
            setError('Đã xảy ra lỗi khi cập nhật phiếu nhập hàng');
        }
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <StyledCard>
                <CardContent>
                    <Grid container spacing={3} alignItems="center" mb={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                                Kiểm Tra Phiếu Nhập Hàng
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                        {timeRange === 'custom' && (
                            <Grid item xs={12} md={3}>
                                <StyledInput
                                    type="date"
                                    value={customDate}
                                    onChange={handleCustomDateChange}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} md={timeRange === 'custom' ? 2 : 5} container justifyContent="flex-end" spacing={2}>
                            <Grid item>
                                <StyledButton
                                    startIcon={<DeleteIcon />}
                                    onClick={toggleShowDisposed}
                                    variant="contained"
                                    color={showDisposed ? "error" : "primary"}
                                    size="large"
                                >
                                    {showDisposed ? "Ẩn sản phẩm đã hủy" : "Hiện sản phẩm đã hủy"}
                                </StyledButton>
                            </Grid>
                            <Grid item>
                                <StyledButton 
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate(-1)}
                                    variant="contained"
                                    size="large"
                                >
                                    Quay lại
                                </StyledButton>
                            </Grid>
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
                                    <StyledTableCell align="center">Thao tác</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedReceipts.map((receipt) => (
                                    <TableRow 
                                        key={receipt.id}
                                        hover
                                        sx={{ 
                                            '&:hover': { backgroundColor: '#f5f5f5' },
                                            backgroundColor: receipt.details.some(detail => detail.status === 'Hư hỏng') ? '#ffebee' : 'inherit'
                                        }}
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
                                        <TableCell align="center">
                                            <StyledButton
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenCheckDialog(receipt)}
                                                size="small"
                                            >
                                                Kiểm tra hàng
                                            </StyledButton>
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

            <Dialog
                open={openDialog}
                onClose={handleCloseCheckDialog}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }
                }}
            >
                <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                                Kiểm tra hàng - Phiếu nhập #{selectedReceipt?.id}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary">
                                Thời gian kiểm tra: {checkTime}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Sản phẩm</StyledTableCell>
                                    <StyledTableCell align="center">Số lượng nhập</StyledTableCell>
                                    <StyledTableCell align="center">Số lượng kiểm tra</StyledTableCell>
                                    <StyledTableCell align="center">Trạng thái</StyledTableCell>
                                    <StyledTableCell align="center">Ngày sản xuất</StyledTableCell>
                                    <StyledTableCell align="center">Hạn sử dụng</StyledTableCell>
                                    <StyledTableCell align="center">Ghi chú</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedReceipt?.details?.map((detail) => (
                                    detail.status !== 'Đã hủy' && (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                                            <TableCell align="center">{detail.quantity}</TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        type="number"
                                                        value={checkResults[detail.id]?.quantity_receipt || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'quantity_receipt', e.target.value)}
                                                        min={0}
                                                        max={detail.quantity}
                                                        style={{ textAlign: 'center' }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') ? (
                                                    <Select
                                                        fullWidth
                                                        size="small"
                                                        value={checkResults[detail.id]?.status || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'status', e.target.value)}
                                                        sx={{ borderRadius: '8px' }}
                                                    >
                                                        <MenuItem value="1">Đủ hàng hóa</MenuItem>
                                                        <MenuItem value="2">Hư hỏng</MenuItem>
                                                        <MenuItem value="3">Thiếu</MenuItem>
                                                    </Select>
                                                ) : (
                                                    <Chip
                                                        label={detail.status}
                                                        color={
                                                            detail.status === 'Đủ hàng hóa' ? 'success' :
                                                            detail.status === 'Hư hỏng' ? 'error' :
                                                            'warning'
                                                        }
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        type="date"
                                                        value={checkResults[detail.id]?.production_date || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'production_date', e.target.value)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        type="date"
                                                        value={checkResults[detail.id]?.expiration_date || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'expiration_date', e.target.value)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        type="text"
                                                        value={checkResults[detail.id]?.note || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'note', e.target.value)}
                                                        placeholder="Ghi chú"
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                    <StyledButton onClick={handleCloseCheckDialog} variant="outlined">
                        Hủy
                    </StyledButton>
                    <StyledButton onClick={handleSubmitCheck} variant="contained" color="primary">
                        Lưu kết quả kiểm tra
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReceiptCheck;
