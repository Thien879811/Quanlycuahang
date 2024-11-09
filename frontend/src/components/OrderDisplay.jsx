import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderDisplay = ({ orderProducts, handleIncreaseQuantity, handleDecreaseQuantity, handleRemoveProduct, getTotalDiscount }) => {
  return (
    <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Đơn giá</TableCell>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Số lượng</TableCell>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Khuyến mãi</TableCell>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Thành tiền</TableCell>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Ghi chú</TableCell>
            <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>Xóa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderProducts.length > 0 ? (
            orderProducts.map((item, index) => {
              const total = item.price ? ((item.price * item.quantity) - (item.discount || 0)) : 0;
              return (
                <TableRow 
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#f5f5f5',
                    },
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{item.product_name}</TableCell>
                  <TableCell sx={{ color: '#2196f3' }}>{item.price ? Math.floor(item.price/100)*100 : 0}₫</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      borderRadius: '20px',
                      padding: '2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      width: '120px',
                      margin: '0 auto'
                    }}>
                      <IconButton 
                        onClick={() => handleDecreaseQuantity(item.product_id)} 
                        size="small"
                        sx={{ color: '#f44336' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ 
                        mx: 2, 
                        fontWeight: 'bold',
                        width: '20px',
                        textAlign: 'center'
                      }}>
                        {item.quantity}
                      </Typography>
                      <IconButton 
                        onClick={() => handleIncreaseQuantity(item.product_id)} 
                        size="small"
                        sx={{ color: '#4caf50' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#f44336' }}>{item.discount ? Math.floor(item.discount/100)*100 : 0}₫</TableCell>
                  <TableCell sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {Math.floor(total/100)*100}₫
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleRemoveProduct(item.product_id)} 
                      size="small"
                      sx={{ 
                        color: '#f44336',
                        '&:hover': {
                          backgroundColor: '#ffebee'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="h6" sx={{ color: '#9e9e9e', fontStyle: 'italic' }}>
                  Không có sản phẩm
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDisplay;