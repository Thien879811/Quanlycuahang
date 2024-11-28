import React, { useState, useEffect, useCallback } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
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
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importDate, setImportDate] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchSuppliers();
      await fetchProducts();
      if (id) {
        setIsEditing(true);
        await fetchReceipt(id);
      }
    };
    init();
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
        })),
        status: '0'
      };

      let response;
      if (isEditing) {
        response = await Receipt.chinhsua(id, importData);
      } else {
        response = await Receipt.createReceipt(importData);
      }

      const data = handleResponse(response);
      if(data.success){
        alert(isEditing ? 'Phiếu nhập đã được cập nhật thành công!' : 'Phiếu nhập đã được tạo thành công!');
        navigate('/admin/inventory-check');
      } else {
        alert('Có lỗi xảy ra.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra.');
    }
  };

  const fetchReceipt = async (id) => {
    try {
      const response = await Receipt.get(id);
      const data = handleResponse(response);
      setReceipt(data.goods_receipt);
      
      // Find supplier after suppliers are loaded
      const supplier = suppliers.find(s => s.id == data.goods_receipt.supplier_id);
      setSelectedSupplier(supplier);
      
      setImportDate(data.goods_receipt.import_date);
      
      // Map receipt details to selected products
      const mappedProducts = data.goods_receipt.details.map(detail => ({
        product: products.find(p => p.id === detail.product_id) || {
          id: detail.product_id,
          product_name: detail.product.product_name
        },
        quantity: detail.quantity,
        price: detail.price
      }));
      
      setSelectedProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching receipt:', error);
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
            {isEditing ? 'Chỉnh Sửa Phiếu Nhập Hàng' : 'Tạo Phiếu Nhập Hàng'}
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  value={selectedSupplier}
                  options={suppliers}
                  getOptionLabel={(option) => option?.factory_name || ''}
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
                          value={item.product}
                          options={products.filter(product => 
                            !selectedProducts.some(selected => 
                              selected.product?.id === product.id && selected !== item
                            )
                          )}
                          getOptionLabel={(option) => option?.product_name || ''}
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
                {isEditing ? 'Cập nhật phiếu nhập' : 'Tạo phiếu nhập'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImportAdmin;
