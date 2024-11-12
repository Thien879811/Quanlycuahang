import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Factory from '../../../services/factory.service';
import Product from '../../../services/product.service';
import Receipt from '../../../services/receipt.service';
import { Link } from 'react-router-dom';
import { handleResponse } from '../../../functions';

const ImportAdmin = () => {
  const theme = useTheme();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importDate, setImportDate] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await Factory.getAll();
      const data = handleResponse(response);
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await Product.getAll();
      const data = handleResponse(response);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product: null, quantity: 0, price: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const importData = {
        supplier_id: selectedSupplier.id,
        import_date: importDate,
        products: selectedProducts.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      console.log(importData);
      const response = await Receipt.create(importData);
      const data = handleResponse(response);
      if(data.success){
        alert('Phiếu nhập đã được tạo thành công!');
      }else{
        alert('Có lỗi xảy ra khi tạo phiếu nhập.');
      }
      setSelectedProducts([]);
      setSelectedSupplier(null);
      setImportDate('');
    } catch (error) {
      console.error('Error creating import:', error);
      alert('Có lỗi xảy ra khi tạo phiếu nhập.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          component={Link}
          to="/admin/import-history"
          variant="outlined"
          startIcon={<HistoryIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s'
          }}
        >
          Lịch sử trả hàng
        </Button>
        <Button
          component={Link} 
          to="/admin/inventory-check"
          variant="outlined"
          startIcon={<AssignmentIcon />}
          sx={{ 
            borderRadius: 2,
            px: 3,
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s'
          }}
        >
          Kiểm tra phiếu nhập
        </Button>
      </Box>
      
      <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          bgcolor: theme.palette.primary.main, 
          py: 3, 
          px: 4,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <LocalShippingIcon fontSize="large" />
          <Typography variant="h4">
            Tạo Phiếu Nhập Hàng
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={suppliers}
                  getOptionLabel={(option) => option.factory_name}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      label="Nhà cung cấp" 
                      required 
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        minWidth: '400px'
                      }}
                    />
                  }
                  onChange={(_, newValue) => setSelectedSupplier(newValue)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ngày nhập"
                  type="date"
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={importDate}
                  onChange={(e) => setImportDate(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 5, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <InventoryIcon color="primary" fontSize="large" />
              <Typography variant="h5" color="primary" fontWeight="bold">
                Danh sách sản phẩm nhập
              </Typography>
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.primary }}>
                    <TableCell width="40%" sx={{ color: 'dark', fontWeight: 'bold' }}>Sản phẩm</TableCell>
                    <TableCell width="20%" sx={{ color: 'dark', fontWeight: 'bold' }}>Số lượng</TableCell>
                    <TableCell width="20%" sx={{ color: 'dark', fontWeight: 'bold' }}>Giá nhập</TableCell>
                    <TableCell width="20%" sx={{ color: 'dark', fontWeight: 'bold' }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedProducts.map((item, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}>
                      <TableCell>
                        <Autocomplete
                          options={products.filter(product => !selectedProducts.some(selected => selected.product?.id === product.id))}
                          getOptionLabel={(option) => option.product_name}
                          renderInput={(params) => 
                            <TextField 
                              {...params} 
                              required 
                              variant="outlined"
                              size="small"
                              sx={{ 
                                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                minWidth: '300px'
                              }}
                            />
                          }
                          onChange={(_, newValue) => handleProductChange(index, 'product', newValue)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.price}
                          onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                          required
                          variant="outlined"
                          size="small"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleRemoveProduct(index)}
                          color="error"
                          sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddProduct}
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  '&:hover': { transform: 'translateY(-2px)' },
                  transition: 'transform 0.2s'
                }}
              >
                Thêm sản phẩm
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  '&:hover': { transform: 'translateY(-2px)' },
                  transition: 'transform 0.2s'
                }}
              >
                Tạo phiếu nhập
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImportAdmin;
