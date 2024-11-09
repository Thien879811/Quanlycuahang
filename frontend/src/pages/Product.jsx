import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardProduct from '../components/CardProduct';
import useProducts from '../utils/productUtils';
import { Box, Grid, Table, Button, Typography, List, ListItem, ListItemText, Paper, TextField, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CataloryService from '../services/catalory.service';
import { handleResponse } from '../functions';

const Product = () => {
    const navigate = useNavigate();
    const {products} = useProducts();
    const [orderProducts, setOrderProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchOrderData = () => {
        const storedOrderProduct = JSON.parse(localStorage.getItem('order_product')) || [];
        setOrderProducts(storedOrderProduct);
    };

    const Style = styled(Sheet)(({ theme }) => ({
        padding: theme.spacing(1),
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: theme.shadow.md
        }
    }));

    const deleteOrder = (id) => {
        const updatedOrders = orderProducts.filter(product => product.product_id !== id);
        localStorage.setItem('order_product', JSON.stringify(updatedOrders));
        setOrderProducts(updatedOrders);
    };

    useEffect(() => {
        fetchOrderData();
        const fetchCategories = async () => {
            try {
                const response = await CataloryService.getAll();
                const data = handleResponse(response);
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleProductClick = (product) => {
        const updatedOrderProducts = [...orderProducts];
        const existingProductIndex = updatedOrderProducts.findIndex(p => p.product_id === product.id);
        
        if (existingProductIndex !== -1) {
            updatedOrderProducts[existingProductIndex].quantity += 1;
        } else {
            updatedOrderProducts.push({
                product_id: product.id,
                product_name: product.product_name,
                image: product.image,
                quantity: 1,
                price: product.selling_price,
                discount: 0
            });
        }
        
        localStorage.setItem('order_product', JSON.stringify(updatedOrderProducts));
        setOrderProducts(updatedOrderProducts);
    };

    const filteredProducts = products.filter(product => {
        if (!selectedCategory) return true;
        return product.catalogy_id === selectedCategory;
    });

    const searchFilteredProducts = filteredProducts.filter(product => 
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm))
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Button 
                variant="contained" 
                color="primary"
                startIcon={<CloseIcon />} 
                onClick={() => navigate('/')}
                sx={{ 
                    mb: 2, 
                    float: 'right',
                    boxShadow: 3,
                    '&:hover': {
                        transform: 'scale(1.05)'
                    }
                }}
            >
                Đóng
            </Button>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm theo tên sản phẩm hoặc mã vạch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            }
                        }
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <Paper elevation={5} sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                            Danh mục sản phẩm
                        </Typography>
                        <List component="nav" sx={{ borderRadius: 1 }}>
                            <ListItem 
                                button 
                                onClick={() => setSelectedCategory(null)} 
                                sx={{ 
                                    backgroundColor: selectedCategory === null ? 'primary.light' : 'transparent',
                                    borderRadius: 1,
                                    mb: 1,
                                    '&:hover': {
                                        backgroundColor: selectedCategory === null ? 'primary.light' : 'action.hover'
                                    }
                                }}
                            >
                                <ListItemText primary="Tất cả sản phẩm" />
                            </ListItem>
                            {categories.map((category) => (
                                <ListItem 
                                    button 
                                    key={category.id} 
                                    onClick={() => setSelectedCategory(category.id)}
                                    sx={{ 
                                        backgroundColor: selectedCategory === category.id ? 'primary.light' : 'transparent',
                                        borderRadius: 1,
                                        mb: 1,
                                        '&:hover': {
                                            backgroundColor: selectedCategory === category.id ? 'primary.light' : 'action.hover'
                                        }
                                    }}
                                >
                                    <ListItemText primary={category.catalogy_name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                
                <Grid item xs={8} container spacing={3}>
                    {searchFilteredProducts.map((product) => (  
                        <Grid item xs={4} key={product.id}>
                            <Style>
                                <CardProduct product={product} onClick={() => handleProductClick(product)} />
                            </Style>
                        </Grid>
                    ))}
                </Grid>

                <Grid item xs={2}>
                    <TableContainer component={Paper} elevation={5} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>SL</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderProducts.map((product) => (  
                                    <TableRow 
                                        key={product.product_id}
                                        sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        <TableCell>{product.product_name}</TableCell>
                                        <TableCell>{product.quantity}</TableCell>
                                        <TableCell>
                                            <Button 
                                                onClick={() => deleteOrder(product.product_id)} 
                                                color="error"
                                                size="small"
                                                sx={{ minWidth: 'auto' }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Product;