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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Factory from '../../../services/factory.service';
import Product from '../../../services/product.service';
import Receipt from '../../../services/receipt.service';

import { handleResponse } from '../../../functions';

const ImportAdmin = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importDate, setImportDate] = useState('');

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      const filtered = products.filter(product => product.factory_id === selectedSupplier.id);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedSupplier, products]);

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
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Tạo Phiếu Nhập Hàng
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) => option.factory_name}
              renderInput={(params) => <TextField {...params} label="Nhà cung cấp" required />}
              onChange={(_, newValue) => setSelectedSupplier(newValue)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ngày nhập"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={importDate}
              onChange={(e) => setImportDate(e.target.value)}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
          Sản phẩm nhập
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Giá nhập</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Autocomplete
                      options={filteredProducts}
                      getOptionLabel={(option) => option.product_name}
                      renderInput={(params) => <TextField {...params} required />}
                      onChange={(_, newValue) => handleProductChange(index, 'product', newValue)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveProduct(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          style={{ marginTop: '10px' }}
        >
          Thêm sản phẩm
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Tạo phiếu nhập
        </Button>
      </form>
    </Container>
  );
};

export default ImportAdmin;
