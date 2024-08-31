import React, { useEffect, useState } from 'react';
import CardProduct from '../components/CardProduct';
import useProducts from '../utils/productUtils';
import { Box, Grid, Table } from '@mui/material';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import DeleteIcon from '@mui/icons-material/Delete';


const Product = () => {

    const {products} = useProducts();
    const [orderProducts, setOrderProducts] = useState([]);

   
    const fetchOrderData = () => {
        const storedOrderProduct = JSON.parse(localStorage.getItem('order_product')) || [];
        setOrderProducts(storedOrderProduct);
    };

    const Style = styled(Sheet)(({ theme }) => ({
        padding: theme.spacing(1),
    }));

    const deleteOrder = (id) => {
        const updatedOrders = orderProducts.filter(product => product.product_id !== id);
        console.log(updatedOrders)
        localStorage.setItem('order_product', JSON.stringify(updatedOrders));
        setOrderProducts(updatedOrders);
    };

    useEffect(() => {
        fetchOrderData();
    }, []);
    return(
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} direction="row">

                <Grid item xs={9} container spacing={2} direction="row">

                    {products.map((product)=>(  
                        <Style>
                            <CardProduct xs={3} product ={product} onClick={() => fetchOrderData()}/>
                        </Style>
                    ))}


                </Grid>
                <Grid item xs={3}>
                    <Table aria-label="basic table" stripe="even"  variant="soft">
                        <thead>
                          <tr>
                            <th style={{ width: '40%' }}>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th></th>
                          </tr>
                        </thead>
                        {orderProducts.map((product)=>(  
                        <tbody>
                          <tr>
                            <td>{product.product_name}</td>
                            <td>{product.soluong}</td>
                            <td><button onClick ={()=>deleteOrder(product.product_id)} ><DeleteIcon/></button></td>
                          </tr>
                        </tbody>
                         ))}
                    </Table>
                </Grid>
            </Grid>
        </Box>
        
    )
};

export default Product;