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
    Checkbox,
    TextField
} from '@mui/material';
import ReceiptService from '../../../services/receipt.service';
import { handleResponse } from '../../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { styled } from '@mui/material/styles';
import ReturnDialog from '../../../components/receipts/ReturnDialog';

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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [checkResults, setCheckResults] = useState({});
    const [checkTime, setCheckTime] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [returnReason, setReturnReason] = useState('');

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

    const fetchAllReceipts = async () => {
        try {
            const response = await ReceiptService.getReceipt(timeRange, customDate);
            const data = handleResponse(response);
            
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
                setFilteredReceipts(processedReceipts);
                setError('');
            } else {
                setError('Không thể tải danh sách phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setError('Đã xảy ra lỗi khi tải danh sách phiếu nhập hàng');
        }
    };

    const handleSearch = (searchValue) => {
        const searchLower = searchValue.toLowerCase();
        const filtered = receipts.filter(receipt => 
            receipt.id.toString().includes(searchLower) ||
            receipt.supplier?.factory_name.toLowerCase().includes(searchLower) ||
            receipt.status.toLowerCase().includes(searchLower)
        );
        setFilteredReceipts(filtered);
        setPage(0);
    };

    const handleOpenCheckDialog = (receipt) => {
        const initialCheckResults = receipt.details.reduce((acc, detail) => ({
            ...acc,
            [detail.id]: {
                status: '1',
                note: '',
                production_date: null,
                expiration_date: null,
                quantity_receipt: detail.quantity
            }
        }), {});

        setSelectedReceipt(receipt);
        setCheckResults(initialCheckResults);
        setCheckTime(dayjs().format('DD/MM/YYYY HH:mm:ss'));
        setOpenDialog(true);
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
                [detailId]: { 
                    ...prev[detailId], 
                    [field]: value,
                    status: field === 'quantity_receipt' && 
                           Number(value) !== selectedReceipt.details.find(d => d.id === detailId).quantity 
                           ? '0' : prev[detailId].status
                }
            };
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
                    ...checkResults[detail.id]
                }))
            };

            const response = await ReceiptService.update(updatedReceipt.id, updatedReceipt);
            const data = handleResponse(response);
            
            if (data.success) {
                await fetchAllReceipts();
                handleCloseCheckDialog();
            } else {
                setError('Không thể cập nhật phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error updating receipt:', error);
            setError('Đã xảy ra lỗi khi cập nhật phiếu nhập hàng');
        }
    };

    const handleDelete = async (receiptId) => {
        try {
            const response = await ReceiptService.delete(receiptId);
            if (response.success) {
                setReceipts(prev => prev.filter(r => r.id !== receiptId));
                setFilteredReceipts(prev => prev.filter(r => r.id !== receiptId));
                setOpenDeleteDialog(false);
            } else {
                setError('Không thể xóa phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error deleting receipt:', error);
            setError('Đã xảy ra lỗi khi xóa phiếu nhập hàng');
        }
    };

    const handleEdit = async (receipt) => {
        try {
            const response = await ReceiptService.update(receipt.id, receipt);
            if (response.success) {
                await fetchAllReceipts();
                setOpenEditDialog(false);
            } else {
                setError('Không thể cập nhật phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error updating receipt:', error);
            setError('Đã xảy ra lỗi khi cập nhật phiếu nhập hàng');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleOpenReturnDialog = (receipt) => {
        setSelectedReceipt(receipt);
        setSelectedProducts([]);
        setReturnQuantities({});
        setReturnReason('');
        setOpenReturnDialog(true);
    };

    const handleProductSelect = (detail) => {
        setSelectedProducts(prev => {
            const isSelected = prev.includes(detail.id);
            return isSelected ? prev.filter(id => id !== detail.id) : [...prev, detail.id];
        });
    };

    const handleReturnQuantityChange = (detailId, quantity) => {
        setReturnQuantities(prev => ({
            ...prev,
            [detailId]: quantity
        }));
    };

    const handleSubmitReturn = async () => {
        try {
            const returnData = {
                receipt_id: selectedReceipt.id,
                products: selectedProducts.map(detailId => ({
                    detail_id: detailId,
                    product_id: selectedReceipt.details.find(d => d.id === detailId).product.id,
                    return_quantity: returnQuantities[detailId],
                })),
                reason: returnReason,
                status: 'pending'
            };

            const response = await ReceiptService.returnReceipt(returnData);
            if (response.success) {
                setOpenReturnDialog(false);
                await fetchAllReceipts();
            } else {
                setError('Không thể tạo phiếu trả hàng');
            }
        } catch (error) {
            console.error('Error creating return:', error);
            setError('Đã xảy ra lỗi khi tạo phiếu trả hàng');
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
                        <Grid item xs={12} md={timeRange === 'custom' ? 2 : 5} container justifyContent="flex-end">
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
                                        <TableCell align="center">
                                            <Grid container spacing={1} justifyContent="center">
                                                <Grid item>
                                                    <StyledButton
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleOpenCheckDialog(receipt)}
                                                        size="small"
                                                    >
                                                        Kiểm tra hàng
                                                    </StyledButton>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton 
                                                        color="primary" 
                                                        onClick={() => setOpenEditDialog(true)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => setOpenDeleteDialog(true)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <StyledButton
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleOpenReturnDialog(receipt)}
                                                        size="small"
                                                    >
                                                        Trả hàng
                                                    </StyledButton>
                                                </Grid>
                                            </Grid>
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
                                    <TableRow key={detail.id}>
                                        <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                                        <TableCell align="center">{detail.quantity}</TableCell>
                                        <TableCell>
                                            <StyledInput
                                                type="number"
                                                value={checkResults[detail.id]?.quantity_receipt || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'quantity_receipt', e.target.value)}
                                                min={0}
                                                max={detail.quantity}
                                                style={{ textAlign: 'center' }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                fullWidth
                                                size="small"
                                                value={checkResults[detail.id]?.status || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'status', e.target.value)}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                <MenuItem value="1">Đủ hàng hóa</MenuItem>
                                                <MenuItem value="2">Hư hỏng</MenuItem>
                                                <MenuItem value="0">Thiếu</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <StyledInput
                                                type="date"
                                                value={checkResults[detail.id]?.production_date || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'production_date', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <StyledInput
                                                type="date"
                                                value={checkResults[detail.id]?.expiration_date || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'expiration_date', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <StyledInput
                                                type="text"
                                                value={checkResults[detail.id]?.note || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'note', e.target.value)}
                                                placeholder="Ghi chú"
                                            />
                                        </TableCell>
                                    </TableRow>
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

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa phiếu nhập hàng này?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
                    <Button onClick={() => handleDelete(selectedReceipt?.id)} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Trả hàng - Phiếu nhập #{selectedReceipt?.id}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Chọn sản phẩm cần trả:
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts(selectedReceipt.details.map(d => d.id));
                                                    } else {
                                                        setSelectedProducts([]);
                                                    }
                                                }}
                                                checked={selectedProducts.length === selectedReceipt?.details?.length}
                                            />
                                        </TableCell>
                                        <TableCell>Sản phẩm</TableCell>
                                        <TableCell align="right">Số lượng đã nhập</TableCell>
                                        <TableCell align="right">Số lượng trả</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedReceipt?.details?.map((detail) => (
                                        <TableRow key={detail.id}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedProducts.includes(detail.id)}
                                                    onChange={() => handleProductSelect(detail)}
                                                />
                                            </TableCell>
                                            <TableCell>{detail.product?.product_name}</TableCell>
                                            <TableCell align="right">{detail.quantity}</TableCell>
                                            <TableCell align="right">
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    value={returnQuantities[detail.id] || ''}
                                                    onChange={(e) => handleReturnQuantityChange(detail.id, e.target.value)}
                                                    inputProps={{ min: 1, max: detail.quantity }}
                                                    disabled={!selectedProducts.includes(detail.id)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TextField
                            fullWidth
                            label="Lý do trả hàng"
                            multiline
                            rows={4}
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReturnDialog(false)}>Hủy</Button>
                    <Button 
                        onClick={handleSubmitReturn} 
                        variant="contained" 
                        color="primary"
                        disabled={selectedProducts.length === 0 || !returnReason}
                    >
                        Xác nhận trả hàng
                    </Button>
                </DialogActions>
            </Dialog> 
        </Box>
    );
};

export default HistoryReceipt;
