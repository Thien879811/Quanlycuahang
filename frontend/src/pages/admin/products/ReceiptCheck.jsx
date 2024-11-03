import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
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
    IconButton,
    Checkbox,
} from '@mui/material';
import ReceiptService from '../../../services/receipt.service';
import { handleResponse } from '../../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ReceiptCheck = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [checkResults, setCheckResults] = useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [returnReason, setReturnReason] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllReceipts();
    }, []);

    const fetchAllReceipts = async () => {
        try {
            const response = await ReceiptService.getAll();
            const data = handleResponse(response);
            if (data.success) {
                // Sort receipts by import_date in descending order (most recent first)
                const sortedReceipts = data.goods_receipts.sort((a, b) => {
                    return new Date(b.import_date) - new Date(a.import_date);
                });

                sortedReceipts.forEach(receipt => {
                    if (receipt.status === '1') {
                        receipt.status = 'Đã kiểm tra';
                    }
                    receipt.details.forEach(detail => {
                        if (detail.status === '1') {
                            detail.status = 'Đủ hàng hóa';
                        }
                        if (detail.status === '3') {
                            detail.status = 'Hư hỏng';
                        }
                        if (detail.status === '2') {
                            detail.status = 'Thiếu';
                        }
                        if (detail.status === '4') {
                            detail.status = 'Đã trả hàng';
                        }
                    });
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

    const handleSearch = () => {
        const filtered = receipts.filter(receipt => 
            receipt.id.toString().includes(searchTerm) ||
            receipt.supplier?.factory_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receipt.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReceipts(filtered);
    };

    const handleOpenCheckDialog = (receipt) => {
        setSelectedReceipt(receipt);
        setCheckResults({});
        receipt.details.forEach(detail => {
            setCheckResults(prev => ({
                ...prev,
                [detail.id]: { status: 'đủ hàng hóa', note: '', received_quantity: detail.quantity }
            }));
        });
        setOpenDialog(true);
    };

    const handleCloseCheckDialog = () => {
        setOpenDialog(false);
        setSelectedReceipt(null);
    };

    const handleCheckResultChange = (detailId, field, value) => {
        setCheckResults(prev => ({
            ...prev,
            [detailId]: { ...prev[detailId], [field]: value }
        }));
    };

    const handleSubmitCheck = async () => {
        try {
            const updatedReceipt = {
                ...selectedReceipt,
                status: 'Đã kiểm tra',
                details: selectedReceipt.details.map(detail => ({
                    ...detail,
                    status: checkResults[detail.id].status,
                    note: checkResults[detail.id].note,
                    received_quantity: checkResults[detail.id].received_quantity
                }))
            };

            const response = await ReceiptService.update(selectedReceipt.id, updatedReceipt);
            if (response.success) {
                setReceipts(receipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));
                setFilteredReceipts(filteredReceipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));
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
                setReceipts(receipts.filter(r => r.id !== receiptId));
                setFilteredReceipts(filteredReceipts.filter(r => r.id !== receiptId));
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
                setReceipts(receipts.map(r => r.id === receipt.id ? receipt : r));
                setFilteredReceipts(filteredReceipts.map(r => r.id === receipt.id ? receipt : r));
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
            if (prev.includes(detail.id)) {
                return prev.filter(id => id !== detail.id);
            } else {
                return [...prev, detail.id];
            }
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
            console.log(response);

            setOpenReturnDialog(false);
            setError('');
        } catch (error) {
            console.error('Error creating return:', error);
            setError('Đã xảy ra lỗi khi tạo phiếu trả hàng');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleGoBack}
                    sx={{ mb: 2 }}
                >
                    Quay lại
                </Button>
                <Typography variant="h4" component="h1" gutterBottom>
                    Kiểm Tra Phiếu Nhập Hàng
                </Typography>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            label="Tìm kiếm phiếu nhập hàng"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nhập mã phiếu, tên nhà cung cấp hoặc trạng thái"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>
                    </Grid>
                </Grid>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {filteredReceipts.map((receipt) => (
                    <Card key={receipt.id} variant="outlined" sx={{ mb: 4 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông tin phiếu nhập #{receipt.id}
                                    </Typography>
                                    <Typography>
                                        Ngày nhập: {new Date(receipt.import_date).toLocaleDateString('vi-VN')}
                                    </Typography>
                                    <Typography>
                                        Nhà cung cấp: {receipt.supplier?.factory_name || 'N/A'}
                                    </Typography>
                                    <Typography>
                                        Tổng số lượng đã nhập: {receipt.details?.reduce((total, detail) => total + detail.quantity, 0)} sản phẩm
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="center">
                                    <Chip 
                                        label={receipt.status} 
                                        color={receipt.status === 'Đã kiểm tra' ? 'success' : 'warning'} 
                                        sx={{ mr: 2 }}
                                    />
                                    <IconButton 
                                        color="primary" 
                                        onClick={() => setOpenEditDialog(true)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        onClick={() => setOpenDeleteDialog(true)}
                                        sx={{ mr: 1 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenCheckDialog(receipt)}
                                        sx={{ mr: 1 }}
                                    >
                                        Kiểm tra hàng
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleOpenReturnDialog(receipt)}
                                    >
                                        Trả hàng
                                    </Button>
                                </Grid>
                            </Grid>

                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell align="right">Số lượng</TableCell>
                                            <TableCell align="right">Số lượng đã nhận</TableCell>
                                            <TableCell align="right">Giá nhập</TableCell>
                                            <TableCell align="right">Thành tiền</TableCell>
                                            <TableCell align="right">Trạng thái</TableCell>
                                            <TableCell align="right">Ghi chú</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {receipt.details?.map((detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                                                <TableCell align="right">{detail.quantity}</TableCell>
                                                <TableCell align="right">{detail.quantity_receipt || detail.quantity}</TableCell>
                                                <TableCell align="right">
                                                    {detail.price?.toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                                <TableCell align="right">
                                                    {(detail.quantity * detail.price)?.toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip 
                                                        label={detail.status || 'Chưa kiểm tra'} 
                                                        color={detail.status === 'đủ hàng hóa' ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{detail.note || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Typography variant="h6">
                                    Tổng cộng:{' '}
                                    {receipt.details
                                        ?.reduce((total, detail) => total + detail.quantity * detail.price, 0)
                                        .toLocaleString('vi-VN')}{' '}
                                    VNĐ
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog open={openDialog} onClose={handleCloseCheckDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Kiểm tra hàng - Phiếu nhập #{selectedReceipt?.id}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                Nhà cung cấp: {selectedReceipt?.supplier?.factory_name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2">
                                Ngày nhập: {selectedReceipt?.import_date && new Date(selectedReceipt.import_date).toLocaleDateString('vi-VN')}
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell align="right">Số lượng đặt</TableCell>
                                    <TableCell align="right">Số lượng đã nhận</TableCell>
                                    <TableCell align="right">Giá nhập</TableCell>
                                    <TableCell align="right">Thành tiền</TableCell>
                                    <TableCell align="right">Trạng thái</TableCell>
                                    <TableCell align="right">Ghi chú</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedReceipt?.details?.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                                        <TableCell align="right">{detail.quantity}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={checkResults[detail.id]?.received_quantity || detail.quantity}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'received_quantity', e.target.value)}
                                                inputProps={{ min: 0, max: detail.quantity }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            {detail.price?.toLocaleString('vi-VN')} VNĐ
                                        </TableCell>
                                        <TableCell align="right">
                                            {(detail.quantity * detail.price)?.toLocaleString('vi-VN')} VNĐ
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Trạng thái</InputLabel>
                                                <Select
                                                    value={checkResults[detail.id]?.status || ''}
                                                    onChange={(e) => handleCheckResultChange(detail.id, 'status', e.target.value)}
                                                >
                                                    <MenuItem value="đủ hàng hóa">Đủ hàng hóa</MenuItem>
                                                    <MenuItem value="damaged">Hư hỏng</MenuItem>
                                                    <MenuItem value="missing">Thiếu</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={2}
                                                size="small"
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
                <DialogActions>
                    <Button onClick={handleCloseCheckDialog}>Hủy</Button>
                    <Button onClick={handleSubmitCheck} variant="contained" color="primary">
                        Lưu kết quả kiểm tra
                    </Button>
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
        </Container>
    );
};

export default ReceiptCheck;
