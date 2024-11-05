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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const ProductDisposal = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [disposalDetails, setDisposalDetails] = useState({
        quantity: '',
        reason: '',
        note: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // TODO: Implement API call to fetch products
            const dummyData = [
                { id: 1, product_name: 'Sản phẩm 1', quantity: 100, expiration_date: '2024-01-01' },
                { id: 2, product_name: 'Sản phẩm 2', quantity: 150, expiration_date: '2024-02-01' }
            ];
            setProducts(dummyData);
            setFilteredProducts(dummyData);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Không thể tải danh sách sản phẩm');
        }
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        
        const filtered = products.filter(product =>
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id.toString().includes(searchTerm)
        );
        setFilteredProducts(filtered);
    };

    const handleOpenDisposalDialog = (product) => {
        setSelectedProduct(product);
        setDisposalDetails({
            quantity: '',
            reason: '',
            note: ''
        });
        setOpenDialog(true);
    };

    const handleCloseDisposalDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
    };

    const handleDisposalDetailsChange = (field, value) => {
        setDisposalDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitDisposal = async () => {
        try {
            // TODO: Implement API call to submit disposal request
            const disposalRequest = {
                product_id: selectedProduct.id,
                quantity: disposalDetails.quantity,
                reason: disposalDetails.reason,
                note: disposalDetails.note,
                request_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
            };

            console.log('Disposal request:', disposalRequest);
            
            // Mock API success
            handleCloseDisposalDialog();
            fetchProducts();
        } catch (error) {
            console.error('Error submitting disposal request:', error);
            setError('Không thể gửi yêu cầu hủy sản phẩm');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                >
                    Quay lại
                </Button>
                <Typography variant="h4" component="h1" gutterBottom>
                    Yêu Cầu Hủy Sản Phẩm
                </Typography>

                <TextField
                    fullWidth
                    label="Tìm kiếm sản phẩm"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ mb: 3 }}
                />

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã sản phẩm</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell align="right">Số lượng tồn</TableCell>
                                <TableCell align="right">Hạn sử dụng</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.product_name}</TableCell>
                                    <TableCell align="right">{product.quantity}</TableCell>
                                    <TableCell align="right">{product.expiration_date}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleOpenDisposalDialog(product)}
                                        >
                                            Yêu cầu hủy
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDisposalDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Yêu cầu hủy sản phẩm - {selectedProduct?.product_name}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Số lượng cần hủy"
                                    type="number"
                                    value={disposalDetails.quantity}
                                    onChange={(e) => handleDisposalDetailsChange('quantity', e.target.value)}
                                    inputProps={{ min: 1, max: selectedProduct?.quantity }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Lý do hủy</InputLabel>
                                    <Select
                                        value={disposalDetails.reason}
                                        onChange={(e) => handleDisposalDetailsChange('reason', e.target.value)}
                                        label="Lý do hủy"
                                    >
                                        <MenuItem value="expired">Hết hạn sử dụng</MenuItem>
                                        <MenuItem value="damaged">Hư hỏng</MenuItem>
                                        <MenuItem value="quality">Không đạt chất lượng</MenuItem>
                                        <MenuItem value="other">Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Ghi chú"
                                    multiline
                                    rows={3}
                                    value={disposalDetails.note}
                                    onChange={(e) => handleDisposalDetailsChange('note', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDisposalDialog}>Hủy</Button>
                        <Button
                            onClick={handleSubmitDisposal}
                            variant="contained"
                            color="error"
                            disabled={!disposalDetails.quantity || !disposalDetails.reason}
                        >
                            Gửi yêu cầu
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default ProductDisposal;
