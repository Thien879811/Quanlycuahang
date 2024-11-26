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
    Select,
    MenuItem,
    InputLabel,
    Grid,
    styled
} from '@mui/material';
import productService from '../../../services/product.service';
import { handleResponse } from '../../../functions';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

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

const ProductDisposal = () => {
    const [disposalRequests, setDisposalRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [approvalNote, setApprovalNote] = useState('');
    const [timeRange, setTimeRange] = useState('all');
    const [customDate, setCustomDate] = useState('');
    const [customMonth, setCustomMonth] = useState('');

    useEffect(() => {
        loadDisposalRequests();
    }, [timeRange, customDate, customMonth]);

    const loadDisposalRequests = async () => {
        try {
            let params = timeRange;
            if (timeRange === 'custom' && customDate) {
                params = { type: 'custom', date: customDate };
            } else if (timeRange === 'custom_month' && customMonth) {
                params = { type: 'custom_month', date: customMonth };
            }
            const response = await productService.getDestroyProduct(params);
            const data = handleResponse(response);
            setDisposalRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading disposal requests:', error);
            setDisposalRequests([]);
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

    const handleOpenDialog = (request) => {
        setSelectedRequest(request);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedRequest(null);
        setOpenDialog(false);
        setApprovalNote('');
    };

    const handleApprove = async () => {
        try {
            const formData = new FormData();
            formData.append('status', 'approved');
            formData.append('note', approvalNote);

            await productService.updateDestroyProductStatus(selectedRequest.id, formData);
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error approving disposal request:', error);
        }
    };

    const handleReject = async () => {
        try {
            const formData = new FormData();
            formData.append('status', 'rejected'); 
            formData.append('note', approvalNote);
            await productService.updateDestroyProductStatus(selectedRequest.id, formData);
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error rejecting disposal request:', error);
        }
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
        <Container maxWidth="lg">
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                my: 4,
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2
            }}>
                <Typography variant="h4" component="h1" sx={{ 
                    fontWeight: 600,
                    color: '#1a365d'
                }}>
                    Hủy sản phẩm
                </Typography>
                <Grid container spacing={2} justifyContent="flex-end" alignItems="center" sx={{ maxWidth: { md: '60%' } }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Thời gian</InputLabel>
                            <Select
                                value={timeRange}
                                onChange={handleTimeRangeChange}
                                label="Thời gian"
                                sx={{ 
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)'
                                    }
                                }}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
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
                        <Grid item xs={12} md={4}>
                            <StyledInput
                                type="date"
                                value={customDate}
                                onChange={handleCustomDateChange}
                            />
                        </Grid>
                    )}
                    {timeRange === 'custom_month' && (
                        <Grid item xs={12} md={4}>
                            <StyledInput
                                type="month"
                                value={customMonth}
                                onChange={handleCustomMonthChange}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Paper sx={{ 
                width: '100%', 
                mb: 4, 
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}>
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
                                <StyledTableCell>Thao tác</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(disposalRequests) && disposalRequests.map((request) => (
                                <TableRow 
                                    key={request.id}
                                    hover
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.04)'
                                        }
                                    }}
                                >
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.product?.product_name || 'N/A'}</TableCell>
                                    <TableCell>{request.quantity}</TableCell>
                                    <TableCell sx={{ 
                                        color: 'dark', 
                                        maxWidth: 200, 
                                        whiteSpace: 'normal', 
                                        wordBreak: 'break-word',
                                        lineHeight: 1.5
                                    }}>
                                        {request.note}
                                    </TableCell>
                                    <TableCell>{dayjs(request.created_at).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{getStatusChip(request.status)}</TableCell>
                                    <TableCell>
                                        {(request.status === 'pending' || request.status === 'PENDING' || !request.status || request.status === '0') && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleOpenDialog(request)}
                                                sx={{ 
                                                    textTransform: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.12)'
                                                    }
                                                }}
                                            >
                                                Xem xét
                                            </Button>
                                        )}
                                    </TableCell>
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
                    sx: { 
                        borderRadius: 3,
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    pb: 2,
                    fontWeight: 600
                }}>
                    Xem xét yêu cầu hủy sản phẩm
                </DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ mt: 3 }}>
                            <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
                                <strong>Sản phẩm:</strong> {selectedRequest.product?.product_name || 'N/A'}
                            </Typography>
                            <Typography sx={{ mb: 2, fontSize: '1.1rem' }}>
                                <strong>Số lượng:</strong> {selectedRequest.quantity}
                            </Typography>
                            <Typography sx={{ mb: 3, fontSize: '1.1rem' }}>
                                <strong>Lý do:</strong> {selectedRequest.note}
                            </Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Ghi chú phê duyệt"
                                multiline
                                rows={3}
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                                variant="outlined"
                                sx={{ 
                                    mt: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ 
                    p: 3, 
                    borderTop: 1, 
                    borderColor: 'divider',
                    gap: 1
                }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3
                        }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleReject} 
                        color="error" 
                        variant="contained"
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            boxShadow: '0 2px 4px rgba(211,47,47,0.2)'
                        }}
                    >
                        Từ chối
                    </Button>
                    <Button 
                        onClick={handleApprove} 
                        color="success" 
                        variant="contained"
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            boxShadow: '0 2px 4px rgba(46,125,50,0.2)'
                        }}
                    >
                        Phê duyệt
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductDisposal;
