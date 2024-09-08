import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const OrderDisplay = ({ orderProducts, handleIncreaseQuantity, handleDecreaseQuantity, handleRemoveProduct }) => {
  return (
    <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Tên sản phẩm</TableCell>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Đơn giá</TableCell>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>SL</TableCell>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>CK</TableCell>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Thành tiền</TableCell>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Ghi chú</TableCell>
            <TableCell sx={{ backgroundColor: '#0000FF', color: 'white' }}>Xóa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderProducts.length > 0 ? (
            orderProducts.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.price ? item.price.toFixed(2) : '0.00'}₫</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleDecreaseQuantity(item.product_id)} size="small">
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton onClick={() => handleIncreaseQuantity(item.product_id)} size="small">
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>0₫</TableCell>
                <TableCell>{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}₫</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveProduct(item.product_id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="h6">Không có sản phẩm</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderDisplay;