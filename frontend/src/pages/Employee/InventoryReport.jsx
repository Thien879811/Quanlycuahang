import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import productService from '../../services/product.service';
import { handleResponse } from '../../functions';
import jsPDF from "jspdf";
import 'jspdf-autotable';

const InventoryReport = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actualQuantity, setActualQuantity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getInventory();
            const data = handleResponse(response);
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = () => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (!expirationDate || dayjs(product.expiration_date).isBefore(dayjs(expirationDate)))
        );
        setFilteredProducts(filtered);
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.text('Báo Cáo Tồn Kho', 14, 15);
        
        const tableColumn = ["Tên sản phẩm", "Số lượng tồn kho", "Hạn sử dụng"];
        const tableRows = filteredProducts.map(product => [
            product.product_name,
            product.quantity,
            dayjs(product.expiration_date).format('DD/MM/YYYY')
        ]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save('bao-cao-ton-kho.pdf');
    };

    const handleOpenDialog = (product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
        setActualQuantity('');
    };

    const handleCheckInventory = async () => {
        if (selectedProduct && actualQuantity !== '') {
            try {
                // Gọi API để cập nhật số lượng thực tế
                await productService.updateInventory(selectedProduct.id, actualQuantity);
                // Cập nhật lại danh sách sản phẩm
                await fetchProducts();
                handleCloseDialog();
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
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
                    Báo Cáo Tồn Kho
                </Typography>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Tìm kiếm sản phẩm"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Hạn sử dụng trước ngày"
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={generateReport}
                        >
                            Tạo báo cáo PDF
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="inventory table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell align="right">Số lượng tồn kho</TableCell>
                                <TableCell align="right">Hạn sử dụng</TableCell>
                                <TableCell align="right">Kiểm tra kho</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {product.product_name}
                                    </TableCell>
                                    <TableCell align="right">{product.quantity}</TableCell>
                                    <TableCell align="right">{dayjs(product.expiration_date).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleOpenDialog(product)}
                                        >
                                            Kiểm tra
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Kiểm tra kho: {selectedProduct?.product_name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Số lượng thực tế"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={actualQuantity}
                        onChange={(e) => setActualQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleCheckInventory}>Xác nhận</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default InventoryReport;
