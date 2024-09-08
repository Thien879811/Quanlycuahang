import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardProduct from '../components/CardProduct';
import useProducts from '../utils/productUtils';
import { Box, Grid, Table, Button, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const Product = () => {
    const navigate = useNavigate();
    const {products} = useProducts();
    const [orderProducts, setOrderProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchOrderData = () => {
        const storedOrderProduct = JSON.parse(localStorage.getItem('order_product')) || [];
        setOrderProducts(storedOrderProduct);
    };

    const Style = styled(Sheet)(({ theme }) => ({
        padding: theme.spacing(1),
    }));

    const deleteOrder = (id) => {
        const updatedOrders = orderProducts.filter(product => product.product_id !== id);
        localStorage.setItem('order_product', JSON.stringify(updatedOrders));
        setOrderProducts(updatedOrders);
    };

    useEffect(() => {
        fetchOrderData();
    }, []);

    const handleProductClick = (product) => {
        const updatedOrderProducts = [...orderProducts];
        const existingProductIndex = updatedOrderProducts.findIndex(p => p.product_id === product.id);
        
        if (existingProductIndex !== -1) {
            updatedOrderProducts[existingProductIndex].quantity += 1;
        } else {
            updatedOrderProducts.push({
                product_id: product.id,
                productName: product.product_name,
                quantity: 1,
                price: product.purchase_price,
            });
        }
        
        localStorage.setItem('order_product', JSON.stringify(updatedOrderProducts));
        setOrderProducts(updatedOrderProducts);
    };

    const categories = [...new Set(products.map(product => product.catalogy_id))];

    const filteredProducts = selectedCategory
        ? products.filter(product => product.catalogy_id === selectedCategory)
        : products;

    return(
        <Box sx={{ flexGrow: 1 }}>
            <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<CloseIcon />} 
                onClick={() => navigate('/')}
                sx={{ mb: 2, float: 'right' }}
            >
                Đóng
            </Button>
            <Grid container spacing={3}>
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f0f4f8' }}>
                        <Typography variant="h6" gutterBottom>Danh mục sản phẩm</Typography>
                        <List component="nav">
                            <ListItem button onClick={() => setSelectedCategory(null)} sx={{ backgroundColor: selectedCategory === null ? '#e3f2fd' : 'transparent' }}>
                                <ListItemText primary="Tất cả" />
                            </ListItem>
                            {categories.map((category) => (
                                <ListItem 
                                    button 
                                    key={category} 
                                    onClick={() => setSelectedCategory(category)}
                                    sx={{ backgroundColor: selectedCategory === category ? '#e3f2fd' : 'transparent' }}
                                >
                                    <ListItemText primary={`Danh mục ${category}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={8} container spacing={3}>
                    {filteredProducts.map((product) => (  
                        <Grid item xs={4} key={product.id}>
                            <Style>
                                <CardProduct product={product} onClick={() => handleProductClick(product)} />
                            </Style>
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={2}>
                    <Table aria-label="order table" stripe="even" variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <thead>
                          <tr>
                            <th style={{ width: '50%', padding: '10px', backgroundColor: '#f5f5f5' }}>Tên sản phẩm</th>
                            <th style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>Số lượng</th>
                            <th style={{ padding: '10px', backgroundColor: '#f5f5f5' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderProducts.map((product) => (  
                            <tr key={product.product_id}>
                              <td style={{ padding: '10px' }}>{product.productName}</td>
                              <td style={{ padding: '10px' }}>{product.quantity}</td>
                              <td style={{ padding: '10px' }}>
                                <Button onClick={() => deleteOrder(product.product_id)} variant="contained" color="secondary" size="small">
                                  <DeleteIcon />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                    </Table>
                </Grid>
            </Grid>
        </Box>  
    )
};

export default Product;