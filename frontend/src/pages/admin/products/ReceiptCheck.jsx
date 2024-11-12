import React, { useState, useEffect, useCallback } from 'react';
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
import ReturnDialog from './receipt/returnDialog';
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
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [returnReason, setReturnReason] = useState('');
    const [editedReceipt, setEditedReceipt] = useState(null);

    const fetchAllReceipts = useCallback(async () => {
        try {
            const response = await ReceiptService.getReceipt(timeRange, customDate);
            const data = handleResponse(response); 
            console.log(data);
            if (data.success) {
                const processedReceipts = data.goods_receipts.map(receipt => ({
                    ...receipt,
                    status: receipt.status === '1' ? 'Đã kiểm tra' : 'Chưa kiểm tra',
                    details: receipt.details.filter(detail => detail.status !== '4').map(detail => ({
                        ...detail,
                        status: {
                            '1': 'Đủ hàng hóa',
                            '2': 'Hư hỏng', 
                            '0': 'Chưa kiểm tra',
                            '3': 'Thiếu',
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
    }, [timeRange, customDate]);

    useEffect(() => {
        fetchAllReceipts();
    }, [fetchAllReceipts]);

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

    const handleSearch = useCallback(() => {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = receipts.filter(receipt => 
            receipt.id.toString().includes(searchTermLower) ||
            receipt.supplier?.factory_name.toLowerCase().includes(searchTermLower) ||
            receipt.status.toLowerCase().includes(searchTermLower)
        );
        setFilteredReceipts(filtered);
        setPage(0);
    }, [searchTerm, receipts]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, handleSearch]);

    const handleOpenCheckDialog = useCallback((receipt) => {
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
    }, []);

    const handleCloseCheckDialog = useCallback(() => {
        setOpenDialog(false);
        setSelectedReceipt(null);
        setCheckResults({});
    }, []);

    const handleCheckResultChange = useCallback((detailId, field, value) => {
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
    }, [selectedReceipt]);

    const handleSubmitCheck = async () => {
        try {
            const updatedReceipt = {
                ...selectedReceipt,
                status: '1',
                check_date: checkTime,
                details: selectedReceipt.details.map(detail => ({
                    ...detail,
                    status: checkResults[detail.id].status,
                    note: checkResults[detail.id].note,
                    production_date: checkResults[detail.id].production_date,
                    expiration_date: checkResults[detail.id].expiration_date,
                    quantity_receipt: checkResults[detail.id].quantity_receipt
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

    const handleDelete = async (receiptId) => {
        try {
            if (!receiptId) {
                setError('Không thể xác định phiếu nhập hàng để xóa');
                return;
            }
            
            const response = await ReceiptService.delete(receiptId);
            const data = handleResponse(response);
            
            if (data.success) {
                setOpenDeleteDialog(false);
                await fetchAllReceipts(); // Refresh the list after successful deletion
                setError('');
            } else {
                setError('Không thể xóa phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error deleting receipt:', error);
            setError('Đã xảy ra lỗi khi xóa phiếu nhập hàng');
        }
    };

    const handleOpenEditDialog = (receipt) => {
        setSelectedReceipt(receipt);
        setEditedReceipt({...receipt});
        setOpenEditDialog(true);
    };

    const handleEdit = async () => {
        try {
            const response = await ReceiptService.updateReceipt(editedReceipt.id, editedReceipt);
            const data = handleResponse(response);
            if (data.success) {
                setReceipts(receipts.map(r => r.id === editedReceipt.id ? editedReceipt : r));
                setFilteredReceipts(filteredReceipts.map(r => r.id === editedReceipt.id ? editedReceipt : r));
                setOpenEditDialog(false);
                setError('');
                await fetchAllReceipts();
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

            setOpenReturnDialog(false);
            setError('');
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
                                                        onClick={() => handleOpenEditDialog(receipt)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => {
                                                            setSelectedReceipt(receipt);
                                                            setOpenDeleteDialog(true);
                                                        }}
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
                                                <MenuItem value="3">Thiếu</MenuItem>
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

            <Dialog 
                open={openDeleteDialog} 
                onClose={() => setOpenDeleteDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        padding: '16px'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Xác nhận xóa phiếu nhập
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa phiếu nhập #{selectedReceipt?.id}?
                    </Typography>
                    <Typography color="error" sx={{ mt: 2 }}>
                        Lưu ý: Hành động này không thể hoàn tác!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDeleteDialog(false)}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={() => handleDelete(selectedReceipt?.id)}
                        variant="contained"
                        color="error"
                    >
                        Xác nhận xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        padding: '16px'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        Chỉnh sửa phiếu nhập #{editedReceipt?.id}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ngày nhập"
                                type="date"
                                value={editedReceipt?.import_date?.split('T')[0] || ''}
                                onChange={(e) => setEditedReceipt({...editedReceipt, import_date: e.target.value})}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú"
                                multiline
                                rows={4}
                                value={editedReceipt?.note || ''}
                                onChange={(e) => setEditedReceipt({...editedReceipt, note: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenEditDialog(false)}
                        variant="outlined"
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleEdit}
                        variant="contained"
                        color="primary"
                    >
                        Lưu thay đổi
                    </Button>
                </DialogActions>
            </Dialog>

            <ReturnDialog
                openReturnDialog={openReturnDialog}
                setOpenReturnDialog={setOpenReturnDialog}
                selectedReceipt={selectedReceipt}
                selectedProducts={selectedProducts}
                handleSubmitReturn={handleSubmitReturn}
                setSelectedProducts={setSelectedProducts}
                setReturnQuantities={setReturnQuantities}
                setReturnReason={setReturnReason}
                returnReason={returnReason}
                returnQuantities={returnQuantities}
            />
        </Box>
    );
};

export default ReceiptCheck;
