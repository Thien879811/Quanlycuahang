import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Receipt from '../../../services/receipt.service';
import { handleResponse } from '../../../functions';

const ReceiptRow = ({ receipt }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(receipt.import_date).toLocaleDateString('vi-VN')}</TableCell>
        <TableCell>{receipt.id}</TableCell>
        <TableCell>{receipt.supplier?.factory_name || 'N/A'}</TableCell>
        <TableCell>{receipt.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết phiếu nhập
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Nhà cung cấp: {receipt.supplier?.factory_name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Địa chỉ: {receipt.supplier?.address || 'N/A'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Số điện thoại: {receipt.supplier?.phone || 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell align="right">Số lượng</TableCell>
                          <TableCell align="right">Giá nhập</TableCell>
                          <TableCell align="right">Tổng tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {receipt.details?.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell component="th" scope="row">
                              {detail.product?.product_name || 'N/A'}
                            </TableCell>
                            <TableCell align="right">{detail.quantity}</TableCell>
                            <TableCell align="right">{detail.price?.toLocaleString('vi-VN')} VNĐ</TableCell>
                            <TableCell align="right">{(detail.quantity * detail.price)?.toLocaleString('vi-VN')} VNĐ</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const HistoryReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [viewMode, setViewMode] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const response = await Receipt.getAll();
      const data = handleResponse(response);
      if (data.success) {
        const sortedReceipts = data.goods_receipts.sort((a, b) => 
          new Date(b.import_date) - new Date(a.import_date)
        );
        setReceipts(sortedReceipts);
      } else {
        console.error('Error fetching receipts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    }
  };

  const filterReceipts = () => {
    let filteredReceipts = receipts;

    if (viewMode !== 'all') {
      filteredReceipts = filteredReceipts.filter(receipt => {
        const receiptDate = new Date(receipt.import_date);
        const selected = new Date(selectedDate);

        switch (viewMode) {
          case 'day':
            return receiptDate.toDateString() === selected.toDateString();
          case 'month':
            return receiptDate.getMonth() === selected.getMonth() && 
                   receiptDate.getFullYear() === selected.getFullYear();
          case 'year':
            return receiptDate.getFullYear() === selected.getFullYear();
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      filteredReceipts = filteredReceipts.filter(receipt =>
        receipt.id.toString().includes(searchTerm) ||
        (receipt.supplier?.factory_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (receipt.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    return filteredReceipts;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch Sử Phiếu Nhập Hàng
        </Typography>
        {/* <Card variant="outlined" sx={{ mb: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Công ty TNHH Thương mại và Dịch vụ Kỹ thuật OCEANTECH
          </Typography>
          <Typography variant="body1" gutterBottom>
            Địa chỉ: 60 Ngô Thì Nhậm, P.Võ Thị Sáu, Q.3, TP.HCM
          </Typography>
          <Typography variant="body1" gutterBottom>
            Điện thoại: (028) 3820 7153 - (028) 3820 7154
          </Typography>
        </Card> */}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="view-mode-label">Chế độ xem</InputLabel>
              <Select
                labelId="view-mode-label"
                value={viewMode}
                label="Chế độ xem"
                onChange={(e) => setViewMode(e.target.value)}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="day">Theo ngày</MenuItem>
                <MenuItem value="month">Theo tháng</MenuItem>
                <MenuItem value="year">Theo năm</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            {viewMode !== 'all' && (
              <TextField
                fullWidth
                label={viewMode === 'day' ? 'Chọn ngày' : viewMode === 'month' ? 'Chọn tháng' : 'Chọn năm'}
                type={viewMode === 'day' ? 'date' : viewMode === 'month' ? 'month' : 'number'}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã phiếu, nhà cung cấp, trạng thái"
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Ngày Nhập</TableCell>
                <TableCell>Mã Phiếu</TableCell>
                <TableCell>Nhà Cung Cấp</TableCell>
                <TableCell>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterReceipts().map((receipt) => (
                <ReceiptRow key={receipt.id} receipt={receipt} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default HistoryReceipt;
