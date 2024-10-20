import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from '@mui/material';
import ReceiptService from '../../services/receipt.service';
import { handleResponse } from '../../functions';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

const ReceiptCheck = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [checkResults, setCheckResults] = useState({});

    useEffect(() => {
        fetchAllReceipts();
    }, []);

    const fetchAllReceipts = async () => {
        try {
        const response = await ReceiptService.getAll();
        const data = handleResponse(response);
        console.log(data);
        if (data.success) {
            data.goods_receipts.forEach(receipt => {
                if (receipt.status === '1') {
                    receipt.status = 'Đã kiểm tra';
                }
                receipt.details.forEach(detail => {
                    if (detail.status === '1') {
                            detail.status = 'Đủ hàng hóa';
                    }
                    if (detail.status === '2') {
                        detail.status = 'Hư hỏng';
                    }
                    if (detail.status === '0') {
                        detail.status = 'Thiếu';
                    }
            });
            });
            setReceipts(data.goods_receipts);
            setFilteredReceipts(data.goods_receipts);
            setError('');
        } else {
            setError('Không thể tải danh sách phiếu nhập hàng');
        }
        } catch (error) {
        console.error('Error fetching receipts:', error);
        setError('Đã xảy ra lỗi khi tải danh sách phiếu nhập hàng');
        }
    };

    const handleSearch = () => {
        const filtered = receipts.filter(receipt => 
        receipt.id.toString().includes(searchTerm) ||
        receipt.supplier?.factory_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReceipts(filtered);
    };

    const handleOpenCheckDialog = (receipt) => {
        setSelectedReceipt(receipt);
        setCheckResults({});
        receipt.details.forEach(detail => {
        setCheckResults(prev => ({
            ...prev,
            [detail.id]: { 
                status: 'Đủ hàng hóa', 
                note: '',
                production_date: null,
                expiration_date: null
            }
        }));
        });
        setOpenDialog(true);
    };

  const handleCloseCheckDialog = () => {
    setOpenDialog(false);
    setSelectedReceipt(null);
  };

  const handleCheckResultChange = (detailId, field, value) => {
    setCheckResults(prev => ({
      ...prev,
      [detailId]: { ...prev[detailId], [field]: value }
    }));
  };

  const handleSubmitCheck = async () => {
    try {
        const updatedReceipt = {
            ...selectedReceipt,
            status: '1',
            details: selectedReceipt.details.map(detail => ({
            ...detail,
            status: checkResults[detail.id].status,
            note: checkResults[detail.id].note,
            production_date: checkResults[detail.id].production_date,
            expiration_date: checkResults[detail.id].expiration_date
            }))
        };

        setReceipts(receipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));
        setFilteredReceipts(filteredReceipts.map(r => r.id === updatedReceipt.id ? updatedReceipt : r));

        console.log(updatedReceipt);

        const response = await ReceiptService.update(updatedReceipt.id, updatedReceipt);
        const data = handleResponse(response);
        if (data.success) {
            console.log(data);
            setError('');
        } else {
            setError('Không thể cập nhật phiếu nhập hàng');
        }
        handleCloseCheckDialog();
        fetchAllReceipts();
    } catch (error) {
        console.error('Error updating receipt:', error);
        setError('Đã xảy ra lỗi khi cập nhật phiếu nhập hàng');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Kiểm Tra Phiếu Nhập Hàng
        </Typography>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Tìm kiếm phiếu nhập hàng"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập mã phiếu, tên nhà cung cấp hoặc trạng thái"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {filteredReceipts.map((receipt) => (
          <Card key={receipt.id} variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin phiếu nhập #{receipt.id}
                  </Typography>
                  <Typography>
                    Ngày nhập: {new Date(receipt.import_date).toLocaleDateString('vi-VN')}
                  </Typography>
                  <Typography>
                    Nhà cung cấp: {receipt.supplier?.factory_name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} container justifyContent="flex-end" alignItems="center">
                  <Chip 
                    label={receipt.status} 
                    color={receipt.status ===  `Đã kiểm tra` ? 'success' : 'warning'} 
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenCheckDialog(receipt)}
                  >
                    Kiểm tra hàng
                  </Button>
                </Grid>
              </Grid>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Số lượng</TableCell>
                      <TableCell align="right">Giá nhập</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                      <TableCell align="right">Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipt.details?.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                        <TableCell align="right">{detail.quantity}</TableCell>
                        <TableCell align="right">
                          {detail.price?.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell align="right">
                          {(detail.quantity * detail.price)?.toLocaleString('vi-VN')} VNĐ
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={detail.status || 'Chưa kiểm tra'} 
                            color={detail.status === 'Đủ hàng hóa' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h6">
                  Tổng cộng:{' '}
                  {receipt.details
                    ?.reduce((total, detail) => total + detail.quantity * detail.price, 0)
                    .toLocaleString('vi-VN')}{' '}
                  VNĐ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={handleCloseCheckDialog} maxWidth="md" fullWidth>
        <DialogTitle>Kiểm tra hàng - Phiếu nhập #{selectedReceipt?.id}</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="right">Số lượng</TableCell>
                  <TableCell align="right">Trạng thái</TableCell>
                  <TableCell align="right">Ngày sản xuất</TableCell>
                  <TableCell align="right">Hạn sử dụng</TableCell>
                  <TableCell align="right">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedReceipt?.details?.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                    <TableCell align="right">{detail.quantity}</TableCell>
                    <TableCell align="right">
                      <FormControl fullWidth size="small">
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          value={checkResults[detail.id]?.status || ''}
                          onChange={(e) => handleCheckResultChange(detail.id, 'status', e.target.value)}
                        >
                          <MenuItem value="1">Đủ hàng hóa</MenuItem>
                          <MenuItem value="2">Hư hỏng</MenuItem>
                          <MenuItem value="0">Thiếu</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="date"
                        label="Ngày sản xuất"
                        value={checkResults[detail.id]?.production_date || ''}
                        onChange={(e) => handleCheckResultChange(detail.id, 'production_date', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="date"
                        label="Hạn sử dụng"
                        value={checkResults[detail.id]?.expiration_date || ''}
                        onChange={(e) => handleCheckResultChange(detail.id, 'expiration_date', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        value={checkResults[detail.id]?.note || ''}
                        onChange={(e) => handleCheckResultChange(detail.id, 'note', e.target.value)}
                        placeholder="Ghi chú"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckDialog}>Hủy</Button>
          <Button onClick={handleSubmitCheck} variant="contained" color="primary">
            Lưu kết quả kiểm tra
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReceiptCheck;