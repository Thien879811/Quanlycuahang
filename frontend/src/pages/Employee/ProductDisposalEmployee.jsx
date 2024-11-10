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
    Tooltip
} from '@mui/material';
import productService from '../../services/product.service';
import { handleResponse } from '../../functions';
import dayjs from 'dayjs';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ProductDisposalEmployee = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [disposalRequests, setDisposalRequests] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [destroyDate, setDestroyDate] = useState(dayjs());
    const [expirationDate, setExpirationDate] = useState(null);

    useEffect(() => {
        loadProducts();
        loadDisposalRequests();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await productService.getAll();
            const data = handleResponse(response);
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        }
    };

    const loadDisposalRequests = async () => {
        try {
            const response = await productService.getDestroyProduct();
            const data = handleResponse(response);
            setDisposalRequests(data);
        } catch (error) {
            console.error('Error loading disposal requests:', error);
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
        setExpirationDate(null);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('product_id', selectedProduct);
            formData.append('quantity', quantity);
            formData.append('destroy_date', destroyDate.format('YYYY-MM-DD'));
            formData.append('note', reason);
            formData.append('status', 'pending');
            if (expirationDate) {
                formData.append('expiration_date', expirationDate.format('YYYY-MM-DD'));
            }

            await productService.createDestroyProduct(formData);
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating disposal request:', error);
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
            <Chip
                icon={icon}
                label={label}
                color={color}
                size="small"
                sx={{ fontWeight: 'medium' }}
            />
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Tooltip title="Quay lại">
                    <IconButton 
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Yêu cầu hủy sản phẩm
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                    sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        boxShadow: 2
                    }}
                >
                    Tạo yêu cầu mới
                </Button>
            </Box>

            <Paper 
                elevation={3} 
                sx={{ 
                    width: '100%', 
                    mb: 4, 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1.1rem' }}>Mã yêu cầu</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1.1rem' }}>Sản phẩm</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1.1rem' }}>Số lượng</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1.1rem' }}>Lý do</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1.1rem' }}>Ngày tạo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', fontSize: '1.1rem' }}>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {disposalRequests.map((request) => (
                                <TableRow 
                                    key={request.id}
                                    hover
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: '#f8f9fa' }
                                    }}
                                >
                                    <TableCell sx={{ fontSize: '1rem' }}>{request.id}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem' }}>{request.product?.product_name || 'N/A'}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem' }}>{request.quantity}</TableCell>
                                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '1rem' }}>
                                        {request.note}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem' }}>{dayjs(request.created_at).format('DD/MM/YYYY')}</TableCell>
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
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.product_name}
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
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            label="Lý do"
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            fullWidth
                            label="Ngày hủy"
                            type="date"
                            value={destroyDate.format('YYYY-MM-DD')}
                            onChange={(e) => setDestroyDate(dayjs(e.target.value))}
                            sx={{ mb: 3 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Hạn sử dụng (nếu có)"
                            type="date"
                            value={expirationDate ? expirationDate.format('YYYY-MM-DD') : ''}
                            onChange={(e) => setExpirationDate(e.target.value ? dayjs(e.target.value) : null)}
                            sx={{ mb: 3 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
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
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Tạo yêu cầu
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductDisposalEmployee;
