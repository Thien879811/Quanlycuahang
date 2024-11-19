import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Checkbox
} from '@mui/material';
import Factory from '../../../../services/factory.service';
import Product from '../../../../services/product.service';
import Receipt from '../../../../services/receipt.service';
import { handleResponse } from '../../../../functions';
import { formatDate } from '../../../../functions';
import { formatCurrency } from '../../../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ReceiptProduct = () => {
    const navigate = useNavigate();
    const [receipts, setReceipts] = useState([]);
    const [timeRange, setTimeRange] = useState('today');
    const [customDate, setCustomDate] = useState({
        startDate: '',
        endDate: ''
    });
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [returnReason, setReturnReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReceipts();
    }, [timeRange, customDate]);

    const fetchReceipts = async () => {
        try {
            const response = await Receipt.getReceipt(timeRange, customDate);
            const data = handleResponse(response);
            // Filter out receipts with status 4
            const filteredReceipts = data.goods_receipts.filter(receipt => receipt.status != 4);
            
            // Calculate total amount for each receipt
            const receiptsWithTotals = filteredReceipts.map(receipt => {
                const total = receipt.details.reduce((sum, detail) => {
                    return sum + (detail.quantity_receipt * detail.price);
                }, 0);
                return {...receipt, total_amount: total};
            });

            setReceipts(receiptsWithTotals);
        } catch (error) {
            console.error('Error fetching receipts:', error);
        }
    };

    const handleOpenDetail = (receipt) => {
        setSelectedReceipt(receipt);
        setOpenDetailDialog(true);
    };

    const handleCloseDetail = () => {
        setSelectedReceipt(null);
        setOpenDetailDialog(false);
    };

    const handleOpenReturn = (receipt) => {
        setSelectedReceipt(receipt);
        setSelectedProducts([]);
        setReturnQuantities({});
        setReturnReason('');
        setOpenReturnDialog(true);
    };

    const handleCloseReturn = () => {
        setOpenReturnDialog(false);
        setSelectedProducts([]);
        setReturnQuantities({});
        setReturnReason('');
        setError('');
    };

    const handleProductSelect = (detailId) => {
        setSelectedProducts(prev => {
            if (prev.includes(detailId)) {
                return prev.filter(id => id !== detailId);
            } else {
                return [...prev, detailId];
            }
        });
    };

    const handleQuantityChange = (detailId, value) => {
        const detail = selectedReceipt.details.find(d => d.id === detailId);
        const maxQuantity = detail.quantity_receipt - (detail.quantity_defective || 0);
        
        if (value > maxQuantity) {
            value = maxQuantity;
        }
        if (value < 0) {
            value = 0;
        }

        setReturnQuantities(prev => ({
            ...prev,
            [detailId]: value
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
                    price: selectedReceipt.details.find(d => d.id === detailId).price,
                    quantity_receipt: selectedReceipt.details.find(d => d.id === detailId).quantity_receipt,
                    quantity_defective: selectedReceipt.details.find(d => d.id === detailId).quantity_defective
                })),
                reason: returnReason,
                status: '1'
            };

            const response = await Receipt.returnReceipt(returnData);
            const data = handleResponse(response);
            if (data.success) {
                handleCloseReturn();
                await fetchReceipts();
            } else {
                setError('Không thể tạo phiếu trả hàng');
            }
        } catch (error) {
            console.error('Error creating return:', error);
            setError('Đã xảy ra lỗi khi tạo phiếu trả hàng');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/admin/import-product')}
                    sx={{ mr: 2 }}
                >
                    Quay lại
                </Button>
                <Typography variant="h4">
                    Danh sách phiếu nhập
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 200, mr: 2 }}>
                    <InputLabel>Thời gian</InputLabel>
                    <Select
                        value={timeRange}
                        label="Thời gian"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="today">Hôm nay</MenuItem>
                        <MenuItem value="yesterday">Hôm qua</MenuItem>
                        <MenuItem value="week">Tuần này</MenuItem>
                        <MenuItem value="month">Tháng này</MenuItem>
                        <MenuItem value="custom">Tùy chỉnh</MenuItem>
                    </Select>
                </FormControl>

                {timeRange === 'custom' && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <TextField
                            label="Từ ngày"
                            type="date"
                            value={customDate.startDate}
                            onChange={(e) => setCustomDate({...customDate, startDate: e.target.value})}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Đến ngày"
                            type="date"
                            value={customDate.endDate}
                            onChange={(e) => setCustomDate({...customDate, endDate: e.target.value})}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã phiếu</TableCell>
                            <TableCell>Ngày nhập</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ghi chú</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {receipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                                <TableCell>#{receipt.id}</TableCell>
                                <TableCell>{formatDate(receipt.import_date)}</TableCell>
                                <TableCell>{formatCurrency(receipt.total_amount)}</TableCell>
                                <TableCell>
                                    {receipt.status === 0 && 'Chờ xử lý'}
                                    {receipt.status === 1 && 'Đã nhập đủ'}
                                    {receipt.status === 2 && 'Thiếu hàng'}
                                    {receipt.status === 3 && 'Có hàng lỗi'}
                                    {receipt.status === 4 && 'Đã trả hàng'}
                                </TableCell>
                                <TableCell>{receipt.note}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        onClick={() => handleOpenDetail(receipt)}
                                    >
                                        Chi tiết
                                    </Button>
                                    {receipt.status !== 4 && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            onClick={() => handleOpenReturn(receipt)}
                                        >
                                            Trả hàng
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDetailDialog} onClose={handleCloseDetail} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết phiếu nhập #{selectedReceipt?.id}</DialogTitle>
                <DialogContent>
                    {selectedReceipt && (
                        <Box>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <Typography><strong>Nhà cung cấp:</strong> {selectedReceipt.supplier?.name}</Typography>
                                    <Typography><strong>Ngày nhập:</strong> {formatDate(selectedReceipt.import_date)}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography><strong>Trạng thái:</strong> {
                                        selectedReceipt.status === 0 ? 'Chờ xử lý' :
                                        selectedReceipt.status === 1 ? 'Đã nhập đủ' :
                                        selectedReceipt.status === 2 ? 'Thiếu hàng' :
                                        selectedReceipt.status === 3 ? 'Có hàng lỗi' :
                                        'Đã trả hàng'
                                    }</Typography>
                                    <Typography><strong>Tổng tiền:</strong> {formatCurrency(selectedReceipt.total_amount)}</Typography>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell>Số lượng nhập</TableCell>
                                            <TableCell>Số lượng lỗi</TableCell>
                                            <TableCell>Ngày sản xuất</TableCell>
                                            <TableCell>Hạn sử dụng</TableCell>
                                            <TableCell>Đơn giá</TableCell>
                                            <TableCell>Thành tiền</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedReceipt.details?.filter(detail => detail.status !== "4").map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>{detail.product?.product_name}</TableCell>
                                                <TableCell>{detail.quantity_receipt}</TableCell>
                                                <TableCell>{detail.quantity_defective}</TableCell>
                                                <TableCell>{formatDate(detail.production_date)}</TableCell>
                                                <TableCell>{formatDate(detail.expiration_date)}</TableCell>
                                                <TableCell>{formatCurrency(detail.price)}</TableCell>
                                                <TableCell>{formatCurrency(detail.quantity_receipt * detail.price)}</TableCell>
                                                <TableCell>
                                                    {detail.status === "1" && 'Đã nhập'}
                                                    {detail.status === "2" && 'Thiếu hàng'}
                                                    {detail.status === "3" && 'Hàng lỗi'}
                                                    {detail.status === "4" && 'Đã trả'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDetail}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openReturnDialog} onClose={handleCloseReturn} maxWidth="md" fullWidth>
                <DialogTitle>Trả hàng - Phiếu nhập #{selectedReceipt?.id}</DialogTitle>
                <DialogContent>
                    {selectedReceipt && (
                        <Box>
                            <TextField
                                fullWidth
                                label="Lý do trả hàng"
                                multiline
                                rows={2}
                                value={returnReason}
                                onChange={(e) => setReturnReason(e.target.value)}
                                sx={{ mb: 2, mt: 2 }}
                            />
                            
                            {error && (
                                <Typography color="error" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <Checkbox />
                                            </TableCell>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell>Số lượng nhập</TableCell>
                                            <TableCell>Số lượng trả</TableCell>
                                            <TableCell>Đơn giá</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedReceipt.details?.filter(detail => detail.status !== "4").map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedProducts.includes(detail.id)}
                                                        onChange={() => handleProductSelect(detail.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{detail.product?.product_name}</TableCell>
                                                <TableCell>{detail.quantity_receipt}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={returnQuantities[detail.id] || ''}
                                                        onChange={(e) => handleQuantityChange(detail.id, parseInt(e.target.value) || 0)}
                                                        disabled={!selectedProducts.includes(detail.id)}
                                                        inputProps={{
                                                            min: 0,
                                                            max: detail.quantity_receipt - (detail.quantity_defective || 0)
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{formatCurrency(detail.price)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReturn}>Hủy</Button>
                    <Button 
                        onClick={handleSubmitReturn}
                        variant="contained"
                        disabled={selectedProducts.length === 0 || !returnReason}
                    >
                        Xác nhận trả hàng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReceiptProduct;
