import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import productService from '../services/product.service';
import useCatalogs from '../utils/catalogUtils';
import useFactory from '../utils/factoryUtils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3),
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [productData, setProductData] = useState({
    product_name: '',
    production_date: '',
    expiration_date: '',
    quantity: '',
    purchase_price: '',
    selling_price: '',
    barcode: '',
    factory_id: '',
    catalogy_id: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { options } = useCatalogs();
  const { f_options } = useFactory();
  const { catalogs, fetchCatalogs } = useCatalogs(); 
  const { factories, fetchFactories } = useFactory();
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    if (product) {
      setProductData(product);
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (Object.values(productData).some(field => field === '') || (!image && !product)) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });
    if (image) {
      formData.append('image', image);
    }
    
    try {
      let response;
      if (product) {
        response = await productService.update(product.id, formData);
        console.log(response);
      } else {
        response = await productService.create(formData);
      }
      setSuccess(product ? 'Sản phẩm đã được cập nhật thành công.' : 'Sản phẩm đã được thêm thành công.');
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Đã xảy ra lỗi.');
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom>{product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</Typography>
      <StyledForm onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Danh Mục</InputLabel>
              <Select
                name="catalogy_id"
                value={productData.catalogy_id}
                onChange={handleChange}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              name="product_name"
              value={productData.product_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ngày sản xuất"
              type="date"
              name="production_date"
              value={productData.production_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Hạn sử dụng"
              type="date"
              name="expiration_date"
              value={productData.expiration_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Giá mua vào"
              type="number"
              name="purchase_price"
              value={productData.purchase_price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Giá bán ra"
              type="number"
              name="selling_price"
              value={productData.selling_price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mã Vạch Sản Phẩm"
              name="barcode"
              value={productData.barcode}
              onChange={handleChange}
            />
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
              <Button variant="contained" component="span">
                {product ? 'Thay đổi hình ảnh' : 'Tải lên hình ảnh'}
              </Button>
            </label>
            {imagePreview && (
              <Box mt={2}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </Box>
            )}
          </Grid>
        </Grid>
        
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onCancel} variant="outlined">
            Hủy
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </Button>
        </Box>
      </StyledForm>
    </StyledPaper>
  );
};

export default ProductForm;
