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
    TextField,
    InputAdornment
} from '@mui/material';
import ReceiptService from '../../services/receipt.service';
import { handleResponse } from '../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { styled } from '@mui/material/styles';
import CheckDialog from './Receipt/CheckDialog';
import ReceiptTable from './Receipt/ReceiptTable';

dayjs.locale('vi');

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    marginBottom: theme.spacing(4),
    background: '#ffffff',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        transform: 'translateY(-2px)'
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    textTransform: 'none',
    padding: '10px 24px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
        transform: 'translateY(-1px)'
    }
}));

const StyledInput = styled('input')(({ theme }) => ({
    padding: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    width: '100%',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.15)',
    },
    '&:hover': {
        borderColor: theme.palette.primary.light
    }
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#fff',
        transition: 'all 0.2s ease',
        '& fieldset': {
            borderWidth: '2px',
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.light,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.15)',
        },
    },
    '& .MuiInputBase-input': {
        padding: '14px',
        fontSize: '16px'
    }
}));

const ReceiptCheck = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState('');
    const [customMonth, setCustomMonth] = useState('');
    const [customYear, setCustomYear] = useState(new Date().getFullYear().toString());
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
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (timeRange === 'custom' && !customDate) {
            setCustomDate(dayjs().format('YYYY-MM-DD'));
        }
        if (timeRange === 'custom_month' && !customMonth) {
            setCustomMonth((new Date().getMonth() + 1).toString());
        }
        fetchAllReceipts();
    }, [timeRange, customDate, customMonth, customYear]);

    useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        let filtered = filteredReceipts;
        if (!showDisposed) {
            filtered = filteredReceipts.filter(receipt => 
                !receipt.details.some(detail => detail.status === 'Hư hỏng')
            );
        }
        
        // Sort receipts - unchecked first
        filtered = [...filtered].sort((a, b) => {
            if (a.status === 'Chưa kiểm tra' && b.status !== 'Chưa kiểm tra') return -1;
            if (a.status !== 'Chưa kiểm tra' && b.status === 'Chưa kiểm tra') return 1;
            return 0;
        });
        
        setDisplayedReceipts(filtered.slice(startIndex, endIndex));
    }, [page, rowsPerPage, filteredReceipts, showDisposed]);

    const handleTimeRangeChange = (event) => {
        const newTimeRange = event.target.value;
        setTimeRange(newTimeRange);
        
        // Reset custom values when changing time range
        if (newTimeRange !== 'custom') {
            setCustomDate('');
        }
        if (newTimeRange !== 'custom_month') {
            setCustomMonth('');
        }
    };

    const handleCustomDateChange = (event) => {
        setCustomDate(event.target.value);
    };

    const handleCustomMonthChange = (event) => {
        setCustomMonth(event.target.value);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const toggleShowDisposed = () => {
        setShowDisposed(!showDisposed);
    };

    const fetchAllReceipts = async () => {
        try {
            let params = timeRange;
            if (timeRange === 'custom' && customDate) {
                params = customDate;
            } else if (timeRange === 'custom_month' && customMonth) {
                params = customMonth;
            }

            const response = await ReceiptService.getReceipt(timeRange, params);
            const data = handleResponse(response);
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
                
                // Sort receipts - unchecked first
                const sortedReceipts = [...data.goods_receipts].sort((a, b) => {
                    if (a.status === 'Chưa kiểm tra' && b.status !== 'Chưa kiểm tra') return -1;
                    if (a.status !== 'Chưa kiểm tra' && b.status === 'Chưa kiểm tra') return 1;
                    return 0;
                });
                
                setReceipts(sortedReceipts);
                setFilteredReceipts(sortedReceipts);
                setError('');
            } else {
                setError('Không thể tải danh sách phiếu nhập hàng');
            }
        } catch (error) {
            console.error('Error fetching receipts:', error);
            setError('Đã xảy ra lỗi khi tải danh sách phiếu nhập hàng');
        }
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);
        
        if (searchValue.trim() === '') {
            setFilteredReceipts(receipts);
            return;
        }

        const filtered = receipts.filter(receipt =>
            receipt.id.toString().includes(searchValue) ||
            receipt.supplier?.factory_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            receipt.status.toLowerCase().includes(searchValue.toLowerCase()) ||
            (receipt.check_date && dayjs(receipt.check_date).format('DD/MM/YYYY').includes(searchValue))
        );
        
        // Sort filtered results - unchecked first
        const sortedFiltered = [...filtered].sort((a, b) => {
            if (a.status === 'Chưa kiểm tra' && b.status !== 'Chưa kiểm tra') return -1;
            if (a.status !== 'Chưa kiểm tra' && b.status === 'Chưa kiểm tra') return 1;
            return 0;
        });
        
        setFilteredReceipts(sortedFiltered);
        setPage(0);
    };

    const handleOpenCheckDialog = (receipt) => {
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
                        quantity_receipt: detail.quantity,
                        quantity_defective: 0
                    }
                }));
            }
        });
        setOpenDialog(true);
        setCheckTime(dayjs().format('DD/MM/YYYY HH:mm:ss'));
        setValidationErrors({});
    };

    const handleCloseCheckDialog = () => {
        setOpenDialog(false);
        setSelectedReceipt(null);
        setCheckResults({});
        setValidationErrors({});
    };

    const validateQuantities = (detailId, field, value) => {
        const detail = selectedReceipt.details.find(d => d.id === detailId);
        const currentResults = checkResults[detailId] || {};
        const quantityReceipt = field === 'quantity_receipt' ? Number(value) : Number(currentResults.quantity_receipt || 0);
        const quantityDefective = field === 'quantity_defective' ? Number(value) : Number(currentResults.quantity_defective || 0);
        
        const errors = {};

        if (quantityReceipt > detail.quantity) {
            errors.quantity_receipt = 'Số lượng nhận không thể lớn hơn số lượng nhập';
        }

        if (quantityDefective > detail.quantity) {
            errors.quantity_defective = 'Số lượng lỗi không thể lớn hơn số lượng nhập';
        }

        if (quantityReceipt + quantityDefective > detail.quantity) {
            errors.total = 'Tổng số lượng nhận và số lượng lỗi không thể lớn hơn số lượng nhập';
        }

        return errors;
    };

    const handleCheckResultChange = (detailId, field, value) => {
        const errors = validateQuantities(detailId, field, value);
        
        if (Object.keys(errors).length === 0) {
            setCheckResults(prev => {
                const updatedResult = {
                    ...prev,
                    [detailId]: { ...prev[detailId], [field]: value }
                };

                if (field === 'quantity_receipt' || field === 'quantity_defective') {
                    const detail = selectedReceipt.details.find(d => d.id === detailId);
                    const quantityReceipt = field === 'quantity_receipt' ? Number(value) : Number(prev[detailId]?.quantity_receipt || 0);
                    const quantityDefective = field === 'quantity_defective' ? Number(value) : Number(prev[detailId]?.quantity_defective || 0);
                    
                    if (quantityReceipt + quantityDefective !== detail.quantity) {
                        updatedResult[detailId].status = quantityDefective > 0 ? '2' : '3';
                    } else {
                        updatedResult[detailId].status = '1';
                    }
                }

                return updatedResult;
            });
            
            setValidationErrors(prev => ({
                ...prev,
                [detailId]: {}
            }));
        } else {
            setValidationErrors(prev => ({
                ...prev,
                [detailId]: errors
            }));
        }
    };

    const handleSubmitCheck = async () => {
        let hasErrors = false;
        const allErrors = {};

        selectedReceipt.details.forEach(detail => {
            if (detail.status === '0' || detail.status === 'Chưa kiểm tra') {
                const detailErrors = validateQuantities(
                    detail.id,
                    null,
                    null
                );
                
                if (Object.keys(detailErrors).length > 0) {
                    hasErrors = true;
                    allErrors[detail.id] = detailErrors;
                }

                const currentResults = checkResults[detail.id] || {};
                if (!currentResults.quantity_receipt) {
                    hasErrors = true;
                    allErrors[detail.id] = {
                        ...allErrors[detail.id],
                        required: 'Vui lòng nhập số lượng nhận được'
                    };
                }
            }
        });

        if (hasErrors) {
            setValidationErrors(allErrors);
            return;
        }

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
                    quantity_receipt: checkResults[detail.id]?.quantity_receipt || detail.quantity_receipt,
                    quantity_defective: checkResults[detail.id]?.quantity_defective || detail.quantity_defective
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

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <Box sx={{ 
            padding: { xs: 2, sm: 3, md: 4 }, 
            backgroundColor: '#f8fafc', 
            minHeight: '100vh'
        }}>
            <StyledCard>
                <CardContent sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
                    <Grid container spacing={4} alignItems="center" mb={3}>
                        <Grid item xs={12} md={4}>
                            <IconButton onClick={handleGoBack} sx={{ mr: 2, marginBottom: '12px', fontSize: '24px' }}>
                                <ArrowBackIcon fontSize="large" />
                            </IconButton>
                            <Typography variant="h4" component="h1" display="inline">
                                Kiểm tra phiếu nhập hàng
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ fontWeight: 500 }}>Thời gian</InputLabel>
                                <Select
                                    value={timeRange}
                                    onChange={handleTimeRangeChange}
                                    label="Thời gian"
                                    sx={{ 
                                        borderRadius: '12px',
                                        height: '48px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderWidth: '2px'
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
                        <Grid item xs={12}>
                            <SearchTextField
                                fullWidth
                                variant="outlined"
                                placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp, trạng thái hoặc ngày kiểm tra..."
                                value={searchTerm}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" sx={{ fontSize: 24 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <ReceiptTable
                        displayedReceipts={displayedReceipts}
                        handleOpenCheckDialog={handleOpenCheckDialog}
                        page={page}
                        handleChangePage={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        filteredReceipts={filteredReceipts}
                    />

                </CardContent>
            </StyledCard>
            <CheckDialog
                openDialog={openDialog}
                handleCloseCheckDialog={handleCloseCheckDialog}
                selectedReceipt={selectedReceipt}
                checkResults={checkResults}
                handleCheckResultChange={handleCheckResultChange}
                handleSubmitCheck={handleSubmitCheck}
                checkTime={checkTime}
                validationErrors={validationErrors}
            />
            
        </Box>
    );
};

export default ReceiptCheck;
