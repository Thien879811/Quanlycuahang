import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Button,
    TableCell,
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
    TextField,
    CircularProgress
} from '@mui/material';
import { DatePicker } from 'antd';
import ReceiptService from '../../../services/receipt.service';
import { handleResponse } from '../../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { styled } from '@mui/material/styles';
import ReturnDialog from './receipt/returnDialog';
import ReceiptTableContainer from './receipt/ReceiptTableContainer';
import CheckReceiptDialog from './receipt/CheckReceiptDialog';

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



const ReceiptCheck = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState('');
    const [customMonth, setCustomMonth] = useState('');
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
    const [checkStatus, setCheckStatus] = useState('unchecked');
    const [loading, setLoading] = useState(false);

    const fetchAllReceipts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ReceiptService.getReceipt(timeRange, timeRange === 'custom_month' ? customMonth : customDate);
            const data = handleResponse(response);
            console.log(data);
            if (data.success) {
                const processedReceipts = data.goods_receipts.map(receipt => ({
                    ...receipt,
                    status: receipt.status === '1' ? 'Đã kiểm tra' : 'Chưa kiểm tra',
                    details: receipt.details.map(detail => ({
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
                // Filter based on check status
                const filtered = checkStatus === 'all' 
                    ? processedReceipts 
                    : processedReceipts.filter(receipt => 
                        checkStatus === 'checked' 
                            ? receipt.status === 'Đã kiểm tra'
                            : receipt.status === 'Chưa kiểm tra'
                    );
                setFilteredReceipts(filtered);
                setError('');
            } else {
                setError('Không thể tải danh sách phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setError('Đã xảy ra lỗi khi tải danh sách phiếu nhập hàng');
        } finally {
            setLoading(false);
        }
    }, [timeRange, customDate, customMonth, checkStatus]);

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

    const handleCustomMonthChange = (event) => {
        setCustomMonth(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearch = useCallback(() => {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = receipts.filter(receipt => {
            const matchesSearch = receipt.id.toString().includes(searchTermLower) ||
                receipt.supplier?.factory_name.toLowerCase().includes(searchTermLower) ||
                receipt.status.toLowerCase().includes(searchTermLower);
            
            const matchesStatus = checkStatus === 'all' 
                ? true 
                : checkStatus === 'checked' 
                    ? receipt.status === 'Đã kiểm tra'
                    : receipt.status === 'Chưa kiểm tra';
            
            return matchesSearch && matchesStatus;
        });
        setFilteredReceipts(filtered);
        setPage(0);
    }, [searchTerm, receipts, checkStatus]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, handleSearch]);

    const handleOpenCheckDialog = useCallback((receipt) => {
        if (receipt.status === 'Đã kiểm tra') {
            const initialCheckResults = receipt.details.reduce((acc, detail) => ({
                ...acc,
                [detail.id]: {
                    status: detail.status === 'Chưa kiểm tra' ? '1' : detail.status === 'Đủ hàng hóa' ? '1' : detail.status === 'Hư hỏng' ? '2' : detail.status === 'Thiếu' ? '3' : '4',
                    note: detail.note || '',
                    production_date: detail.production_date || null,
                    expiration_date: detail.expiration_date || null,
                    quantity_receipt: detail.quantity_receipt || detail.quantity,
                    quantity_defective: detail.quantity_defective || 0
                }
            }), {});
    
            setSelectedReceipt(receipt);
            setCheckResults(initialCheckResults);
            setCheckTime(receipt.check_date);
            setOpenDialog(true);
            return;
        }

        const initialCheckResults = receipt.details.reduce((acc, detail) => ({
            ...acc,
            [detail.id]: {
                status: detail.status === 'Chưa kiểm tra' ? '1' : detail.status === 'Đủ hàng hóa' ? '1' : detail.status === 'Hư hỏng' ? '2' : '3',
                note: detail.note || '',
                production_date: detail.production_date || null,
                expiration_date: detail.expiration_date || null,
                quantity_receipt: detail.quantity_receipt || detail.quantity,
                quantity_defective: detail.quantity_defective || 0
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

            if (field === 'quantity_receipt' || field === 'quantity_defective') {
                const detail = selectedReceipt.details.find(d => d.id === detailId);
                const totalQuantity = Number(updatedResult[detailId].quantity_receipt) + Number(updatedResult[detailId].quantity_defective || 0);
                
                if (detail && totalQuantity !== detail.quantity) {
                    updatedResult[detailId].status = '3'; // Thiếu
                } else if (Number(updatedResult[detailId].quantity_defective) > 0) {
                    updatedResult[detailId].status = '2'; // Hư hỏng
                } else {
                    updatedResult[detailId].status = '1'; // Đủ hàng hóa
                }
            }

            return updatedResult;
        });
    }, [selectedReceipt]);

    const handleSubmitCheck = async () => {
        try {
            if (selectedReceipt.status === 'Đã kiểm tra') {
                setError('Không thể thay đổi kết quả kiểm tra phiếu đã được kiểm tra');
                handleCloseCheckDialog();
                return;
            }

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
                    quantity_receipt: checkResults[detail.id].quantity_receipt,
                    quantity_defective: checkResults[detail.id].quantity_defective
                }))
            };

            setReceipts(receipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));
            setFilteredReceipts(filteredReceipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));


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
            
            const receipt = receipts.find(r => r.id === receiptId);
            if (receipt && receipt.status === 'Đã kiểm tra') {
                setError('Không thể xóa phiếu đã kiểm tra');
                setOpenDeleteDialog(false);
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
        if (receipt.status === 'Đã kiểm tra') {
            setError('Không thể chỉnh sửa phiếu đã kiểm tra');
            return;
        }
        setSelectedReceipt(receipt);
        setEditedReceipt({...receipt});
        setOpenEditDialog(true);
    };

    const handleEdit = async () => {
       navigate(`/admin/import-product/${editedReceipt.id}`);
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
                return_date: dayjs().format('DD/MM/YYYY HH:mm:ss'),
                products: selectedProducts.map(detailId => ({
                    detail_id: detailId,
                    product_id: selectedReceipt.details.find(d => d.id === detailId).product.id,
                    return_quantity: returnQuantities[detailId],
                    price: selectedReceipt.details.find(d => d.id === detailId).price,
                    quantity_receipt: selectedReceipt.details.find(d => d.id === detailId).quantity_receipt,
                    quantity_defective: selectedReceipt.details.find(d => d.id === detailId).quantity_defective
                })),
                reason: returnReason,
                status: '1'
            };
            console.log(returnData);
            const response = await ReceiptService.returnReceipt(returnData);
            const data = handleResponse(response);
            if (data.success) {
                setOpenReturnDialog(false);
                setError('');
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
                            <StyledButton 
                                startIcon={<ArrowBackIcon />}
                                onClick={handleGoBack}
                                size="large"
                                sx={{ borderRadius: 'none' , border: 'none', boxShadow: 'none'}}
                            >
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    Kiểm Tra Phiếu Nhập Kho
                                </Typography>
                            </StyledButton>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={checkStatus}
                                    onChange={(e) => setCheckStatus(e.target.value)}
                                    label="Trạng thái"
                                    sx={{ borderRadius: '8px' }}
                                >
                                    <MenuItem value="unchecked">Chưa kiểm tra</MenuItem>
                                    <MenuItem value="checked">Đã kiểm tra</MenuItem>
                                    <MenuItem value="all">Tất cả</MenuItem>
                                </Select>
                            </FormControl>
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
                                    <MenuItem value="custom">Tùy chọn ngày</MenuItem>
                                    <MenuItem value="custom_month">Tùy chọn tháng</MenuItem>
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
                        {timeRange === 'custom_month' && (
                            <Grid item xs={12} md={2}>
                                <StyledInput
                                    type="month"
                                    value={customMonth}
                                    onChange={handleCustomMonthChange}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} md={timeRange === 'custom' || timeRange === 'custom_month' ? 2 : 4} container justifyContent="flex-end">
                        </Grid>
                    </Grid>
                    <ReceiptTableContainer
                        displayedReceipts={displayedReceipts}
                        handleOpenCheckDialog={handleOpenCheckDialog}
                        handleOpenEditDialog={handleOpenEditDialog}
                        handleOpenReturnDialog={handleOpenReturnDialog}
                        setSelectedReceipt={setSelectedReceipt}
                        setOpenDeleteDialog={setOpenDeleteDialog}
                        page={page}
                        handleChangePage={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        filteredReceipts={filteredReceipts}
                    />
                </CardContent>
            </StyledCard>

            <CheckReceiptDialog
                openDialog={openDialog}
                handleCloseCheckDialog={handleCloseCheckDialog}
                selectedReceipt={selectedReceipt}
                checkResults={checkResults}
                handleCheckResultChange={handleCheckResultChange}
                handleSubmitCheck={handleSubmitCheck}
                checkTime={checkTime}
            />

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
