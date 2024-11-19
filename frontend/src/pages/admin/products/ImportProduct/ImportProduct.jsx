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
  useTheme,
  Tabs,
  Tab,
  Fade,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Factory from '../../../../services/factory.service';
import Product from '../../../../services/product.service';
import Receipt from '../../../../services/receipt.service';
import { handleResponse } from '../../../../functions';
import { useNavigate, Link } from 'react-router-dom';

const ImportProduct = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [importDate, setImportDate] = useState('');
  const [tabValue, setTabValue] = useState(0);

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

  const handleAddProduct = (product) => {
    if (!selectedProducts.find(p => p.product_id === product.id)) {
      setSelectedProducts([...selectedProducts, {
        product_id: product.id,
        product_name: product.product_name,
        quantity: 1,
        price: 0,
        production_date: '',
        expiration_date: ''
      }]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.product_id !== productId));
  };

  const handleQuantityChange = (productId, value) => {
    setSelectedProducts(selectedProducts.map(p => 
      p.product_id === productId ? {...p, quantity: parseInt(value) || 0} : p
    ));
  };

  const handlePriceChange = (productId, value) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.product_id === productId ? {...p, price: parseFloat(value) || 0} : p  
    ));
  };

  const handleProductionDateChange = (productId, value) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.product_id === productId ? {...p, production_date: value} : p
    ));
  };

  const handleExpirationDateChange = (productId, value) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.product_id === productId ? {...p, expiration_date: value} : p
    ));
  };

  const handleSubmit = async () => {
    if (!selectedSupplier || !importDate || selectedProducts.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await Receipt.createReceipt({
        supplier_id: selectedSupplier.id,
        import_date: importDate,
        products: selectedProducts
      });

      const data = handleResponse(response);
      alert('Tạo phiếu nhập hàng thành công');
      
      setSelectedSupplier(null);
      setSelectedProducts([]);
      setImportDate('');
    } catch (error) {
      console.error('Error creating receipt:', error);
      alert('Có lỗi xảy ra khi tạo phiếu nhập hàng');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      navigate('/admin/receipt-product');
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 4, px: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/admin/receipt-product"
            variant="contained"
            startIcon={<ReceiptIcon />}
          >
            Danh sách phiếu nhập
          </Button>
        </Box>
        <Button
          component={Link}
          to="/admin/import-history"
          variant="contained"
          startIcon={<HistoryIcon />}
          sx={{ 
            borderRadius: 3,
            px: 3,
            py: 1.2,
            fontWeight: 600,
            textTransform: 'none',
            background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              backgroundColor: theme.palette.secondary.dark
            },
            transition: 'all 0.3s ease'
          }}
        >
          Lịch sử trả hàng
        </Button>
      </Box>

      {tabValue === 0 && (
        <Fade in={true} timeout={500}>
          <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main, 
                mb: 4,
                borderBottom: `2px solid ${theme.palette.primary.main}`,
                pb: 1
              }}>
                Tạo phiếu nhập hàng
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={suppliers}
                    getOptionLabel={(option) => option.factory_name}
                    value={selectedSupplier}
                    onChange={(event, newValue) => setSelectedSupplier(newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Nhà cung cấp" 
                        fullWidth
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            backgroundColor: 'white',
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ngày nhập"
                    type="date"
                    value={importDate}
                    onChange={(e) => setImportDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.product_name}
                    onChange={(event, newValue) => newValue && handleAddProduct(newValue)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="Thêm sản phẩm" 
                        fullWidth
                        variant="outlined"
                        sx={{ 
                          '& .MuiOutlinedInput-root': { 
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <TableContainer component={Paper} sx={{ 
                mt: 4, 
                borderRadius: 3, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: theme.palette.primary.main,
                      color: 'white'
                    }}>
                      <TableCell sx={{ fontWeight: 600 }}>Tên sản phẩm</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Đơn giá</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Ngày sản xuất</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Hạn sử dụng</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Thành tiền</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((product) => (
                      <TableRow 
                        key={product.product_id} 
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover
                          }
                        }}
                      >
                        <TableCell>{product.product_name}</TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.product_id, e.target.value)}
                            size="small"
                            sx={{ 
                              width: 100,
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 2,
                                '&:hover fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            value={product.price}
                            onChange={(e) => handlePriceChange(product.product_id, e.target.value)}
                            size="small"
                            sx={{ 
                              width: 120,
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 2,
                                '&:hover fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="date"
                            value={product.production_date}
                            onChange={(e) => handleProductionDateChange(product.product_id, e.target.value)}
                            size="small"
                            sx={{ 
                              width: 150,
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 2,
                                '&:hover fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="date"
                            value={product.expiration_date}
                            onChange={(e) => handleExpirationDateChange(product.product_id, e.target.value)}
                            size="small"
                            sx={{ 
                              width: 150,
                              '& .MuiOutlinedInput-root': { 
                                borderRadius: 2,
                                '&:hover fieldset': {
                                  borderColor: theme.palette.primary.main,
                                }
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                          {(product.quantity * product.price).toLocaleString()} VNĐ
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Xóa sản phẩm">
                            <IconButton 
                              onClick={() => handleRemoveProduct(product.product_id)}
                              sx={{ 
                                color: theme.palette.error.main,
                                '&:hover': { 
                                  backgroundColor: theme.palette.error.light,
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s'
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedProducts.length > 0 && (
                      <TableRow sx={{ 
                        backgroundColor: theme.palette.grey[50],
                        '&:hover': {
                          backgroundColor: theme.palette.grey[100]
                        }
                      }}>
                        <TableCell colSpan={5} align="right">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            Tổng cộng:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            {selectedProducts.reduce((sum, product) => 
                              sum + (product.quantity * product.price), 0
                            ).toLocaleString()} VNĐ
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!selectedSupplier || !importDate || selectedProducts.length === 0}
                  startIcon={<AddCircleIcon />}
                  sx={{ 
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { 
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.grey[300],
                      color: theme.palette.grey[500]
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Tạo phiếu nhập
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Box>
  );
};

export default ImportProduct;
