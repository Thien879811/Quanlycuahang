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
    Tabs,
    Tab,
    Autocomplete,
    Alert,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import productService from '../../services/product.service';
import { handleResponse } from '../../functions';

dayjs.locale('vi');

const ProductDisposal = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [disposalDetails, setDisposalDetails] = useState({
        quantity: '',
        reason: '',
        note: '',
        image: null
    });
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [destroyedProducts, setDestroyedProducts] = useState([]);
    const [openNewDisposalDialog, setOpenNewDisposalDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [showAlert, setShowAlert] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    useEffect(() => {
        fetchProducts();
        fetchDestroyProducts();
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await productService.getAll();
            const data = handleResponse(response);
            setAllProducts(data);
        } catch (error) {
            console.error('Error fetching all products:', error);
            showAlertMessage('Không thể tải danh sách sản phẩm', 'error');
        }
    };

    const showAlertMessage = (message, severity = 'success') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const fetchProducts = async () => {
        try {
            const response = await productService.getInventory();
            const destroyResponse = await productService.getDestroyProduct();
            const data = handleResponse(response);
            const destroyData = handleResponse(destroyResponse);
            console.log(data);
            const productsArray = Array.isArray(data) ? data : [];
            
            const today = dayjs();

            // Lọc ra các sản phẩm không có trong danh sách hủy
            const destroyedIds = destroyData.map(dp => dp.product_id);
            const filteredProductsArray = productsArray.filter(product => 
                !destroyedIds.includes(product.id)
            );

            const categorizedProducts = filteredProductsArray.reduce((acc, product) => {
                const expirationDate = dayjs(product.hang_su_dung);
                const daysUntilExpiration = expirationDate.diff(today, 'day');
                
                if (daysUntilExpiration < 0) {
                    acc.expired.push(product);
                } else if (daysUntilExpiration <= 30) {
                    acc.nearExpiration.push(product);
                }
                return acc;
            }, { expired: [], nearExpiration: [] });

            setProducts(categorizedProducts);
            setFilteredProducts(tabValue === 0 ? categorizedProducts.nearExpiration : tabValue === 1 ? categorizedProducts.expired : destroyedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            showAlertMessage('Không thể tải danh sách sản phẩm', 'error');
            setProducts({ expired: [], nearExpiration: [] });
            setFilteredProducts([]);
        }
    };

    const fetchDestroyProducts = async () => {
        try {
            const response = await productService.getDestroyProduct();
            const data = handleResponse(response);
            
            // Filter products based on selected date if tab is 2
            const filteredData = data.filter(product => {
                if (tabValue === 2) {
                    const destroyDate = dayjs(product.destroy_date);
                    return destroyDate.isSame(selectedDate, 'day');
                }
                return true;
            });
            
            setDestroyedProducts(filteredData);
            if (tabValue === 2) {
                setFilteredProducts(filteredData);
            }
        } catch (error) {
            console.error('Error fetching destroyed products:', error);
            showAlertMessage('Không thể tải danh sách sản phẩm đã hủy', 'error');
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) {
            setFilteredProducts(products.nearExpiration);
        } else if (newValue === 1) {
            setFilteredProducts(products.expired);
        } else {
            setFilteredProducts(destroyedProducts);
        }
        setSearchTerm('');
    };

    const handleDateChange = (event) => {
        const newDate = dayjs(event.target.value);
        setSelectedDate(newDate);
        if (tabValue === 2) {
            const filteredData = destroyedProducts.filter(product => {
                const destroyDate = dayjs(product.destroy_date);
                return destroyDate.isSame(newDate, 'day');
            });
            setFilteredProducts(filteredData);
        }
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        
        let currentProducts;
        if (tabValue === 0) {
            currentProducts = products.nearExpiration;
        } else if (tabValue === 1) {
            currentProducts = products.expired;
        } else {
            currentProducts = destroyedProducts;
        }

        const filtered = currentProducts.filter(product =>
            product.product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id.toString().includes(searchTerm)
        );
        setFilteredProducts(filtered);
    };

    const handleOpenDisposalDialog = (product) => {
        setSelectedProduct(product);
        setDisposalDetails({
            quantity: '',
            reason: 'expired',
            note: '',
            image: null
        });
        setOpenDialog(true);
    };

    const handleCloseDisposalDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
    };

    const handleOpenNewDisposalDialog = () => {
        setOpenNewDisposalDialog(true);
        setDisposalDetails({
            quantity: '',
            reason: 'expired',
            note: '',
            image: null
        });
    };

    const handleCloseNewDisposalDialog = () => {
        setOpenNewDisposalDialog(false);
        setSelectedProduct(null);
    };

    const handleDisposalDetailsChange = (field, value) => {
        setDisposalDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setDisposalDetails(prev => ({
            ...prev,
            image: file
        }));
    };

    const handleSubmitDisposal = async () => {
        try {
            const formData = new FormData();
            formData.append('product_id', selectedProduct?.id);
            formData.append('quantity', disposalDetails.quantity);
            formData.append('destroy_date', dayjs().format('YYYY-MM-DD HH:mm:ss'));
            formData.append('note', disposalDetails.reason);
            formData.append('expiration_date', dayjs(disposalDetails.expiration_date).format('YYYY-MM-DD'));
            formData.append('status', '0');
            if (disposalDetails.image) {
                formData.append('image', disposalDetails.image);
            }

            const response = await productService.createDestroyProduct(formData);
            const data = handleResponse(response);
            handleCloseDisposalDialog();
            handleCloseNewDisposalDialog();
            fetchProducts();
            fetchDestroyProducts();
            showAlertMessage('Yêu cầu hủy sản phẩm đã được gửi thành công');
        } catch (error) {
            console.error('Error submitting disposal request:', error);
            const errorResponse = handleResponse(error.response.data);
            const errorMessage = errorResponse.message || 'Có lỗi xảy ra khi gửi yêu cầu hủy sản phẩm';
            showAlertMessage(errorMessage, 'error');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                {showAlert && (
                    <Alert 
                        severity={alertSeverity}
                        sx={{ mb: 2 }}
                        onClose={() => setShowAlert(false)}
                    >
                        {alertMessage}
                    </Alert>
                )}
                
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenNewDisposalDialog}
                    >
                        Thêm yêu cầu hủy mới
                    </Button>
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="Sản phẩm gần hết hạn" />
                    <Tab label="Sản phẩm đã hết hạn" />
                    <Tab label="Sản phẩm đã hủy trong tháng" />
                </Tabs>

                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        label="Tìm kiếm sản phẩm"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {tabValue === 2 && (
                        <TextField
                            type="date"
                            label="Chọn ngày"
                            value={selectedDate.format('YYYY-MM-DD')}
                            onChange={handleDateChange}
                            sx={{ width: 200 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </Stack>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã sản phẩm</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell align="right">Số lượng tồn</TableCell>
                                <TableCell align="right">Hạn sử dụng</TableCell>
                                {tabValue === 2 ? (
                                    <TableCell align="right">Ngày hủy</TableCell>
                                ) : (
                                    <TableCell align="right">{tabValue === 0 ? 'Ngày còn lại' : 'Ngày đã hết hạn'}</TableCell>
                                )}
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(filteredProducts) && filteredProducts.map((product) => {
                                const daysUntilExpiration = dayjs(product.hang_su_dung).diff(dayjs(), 'day');
                                return (
                                    <TableRow 
                                        key={product.id}
                                        sx={{
                                            backgroundColor: tabValue !== 2 && daysUntilExpiration <= 7 ? '#ffebee' : 'inherit'
                                        }}
                                    >
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.product?.product_name}</TableCell>
                                        <TableCell align="right">{product.quantity}</TableCell>
                                        <TableCell align="right">{product.hang_su_dung?.split('T')[0]}</TableCell>
                                        <TableCell align="right">
                                            {tabValue === 2 ? 
                                                dayjs(product.destroy_date).format('DD/MM/YYYY') :
                                                tabValue === 0 ? 
                                                    `${daysUntilExpiration} ngày` : 
                                                    `${Math.abs(daysUntilExpiration)} ngày`
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            {tabValue !== 2 && (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleOpenDisposalDialog(product)}
                                                >
                                                    Yêu cầu hủy
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDisposalDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Yêu cầu hủy sản phẩm - {selectedProduct?.product?.product_name}
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
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="outlined" component="span" fullWidth>
                                        {disposalDetails.image ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                                    </Button>
                                </label>
                                {disposalDetails.image && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Đã chọn: {disposalDetails.image.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDisposalDialog}>Hủy</Button>
                        <Button
                            onClick={handleSubmitDisposal}
                            variant="contained"
                            color="error"
                            disabled={!disposalDetails.quantity || !disposalDetails.reason || !disposalDetails.image}
                        >
                            Gửi yêu cầu
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog mới cho việc thêm yêu cầu hủy sản phẩm */}
                <Dialog open={openNewDisposalDialog} onClose={handleCloseNewDisposalDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Thêm yêu cầu hủy sản phẩm mới
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={allProducts}
                                    getOptionLabel={(option) => `${option?.product_name || ''} (ID: ${option?.id || ''})`}
                                    onChange={(event, newValue) => {
                                        setSelectedProduct(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Chọn sản phẩm"
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Số lượng cần hủy"
                                    type="number"
                                    value={disposalDetails.quantity}
                                    onChange={(e) => handleDisposalDetailsChange('quantity', e.target.value)}
                                    inputProps={{ min: 1 }}
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
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="new-disposal-file"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="new-disposal-file">
                                    <Button variant="outlined" component="span" fullWidth>
                                        {disposalDetails.image ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                                    </Button>
                                </label>
                                {disposalDetails.image && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Đã chọn: {disposalDetails.image.name}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseNewDisposalDialog}>Hủy</Button>
                        <Button
                            onClick={handleSubmitDisposal}
                            variant="contained"
                            color="error"
                            disabled={!selectedProduct || !disposalDetails.quantity || !disposalDetails.reason || !disposalDetails.image}
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
