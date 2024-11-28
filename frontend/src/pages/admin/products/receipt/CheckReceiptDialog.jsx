import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Select, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledInput = styled('input')(({ theme }) => ({
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    width: '100%',
    '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
    }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }
}));

const CheckReceiptDialog = ({
    openDialog,
    handleCloseCheckDialog,
    selectedReceipt,
    checkResults,
    handleCheckResultChange,
    handleSubmitCheck,
    checkTime,
}) => {
    const isReadOnly = selectedReceipt?.status === 'Đã kiểm tra';
    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseCheckDialog}
            maxWidth="xxl"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            {isReadOnly ? 'Chi tiết phiếu nhập' : 'Kiểm tra hàng'} - Phiếu nhập #{selectedReceipt?.id}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" color="text.secondary">
                            Thời gian kiểm tra: {checkTime}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Sản phẩm</StyledTableCell>
                                <StyledTableCell align="center">Số lượng nhập</StyledTableCell>
                                <StyledTableCell align="center">Số lượng nhận được</StyledTableCell>
                                <StyledTableCell align="center">Số lượng lỗi hoặc hư hỏng</StyledTableCell>
                                {isReadOnly && <StyledTableCell align="center">Số lượng đã trả</StyledTableCell>}
                                <StyledTableCell align="center">Trạng thái</StyledTableCell>
                                <StyledTableCell align="center">Ngày sản xuất</StyledTableCell>
                                <StyledTableCell align="center">Hạn sử dụng</StyledTableCell>
                                <StyledTableCell align="center" sx={{ width: '120px' }}>Ghi chú</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedReceipt?.details?.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                                    <TableCell align="center">{detail.quantity}</TableCell>
                                    <TableCell align="center">
                                        {isReadOnly ? (
                                            checkResults[detail.id]?.quantity_receipt || ''
                                        ) : (
                                            <StyledInput
                                                type="number"
                                                value={checkResults[detail.id]?.quantity_receipt || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'quantity_receipt', e.target.value)}
                                                min={0}
                                                max={detail.quantity}
                                                style={{ textAlign: 'center', margin: 'auto' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {isReadOnly ? (
                                            checkResults[detail.id]?.quantity_defective || ''
                                        ) : (
                                            <StyledInput
                                                type="number"
                                                value={checkResults[detail.id]?.quantity_defective || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'quantity_defective', e.target.value)}
                                                min={0}
                                                max={detail.quantity}
                                                style={{ textAlign: 'center', margin: 'auto' }}
                                            />
                                        )}
                                    </TableCell>
                                    {isReadOnly && (
                                        <TableCell align="center">
                                            {detail.return_quantity || ''}
                                        </TableCell>
                                    )}
                                    <TableCell align="center">
                                        {isReadOnly ? (
                                            checkResults[detail.id]?.status === '1' ? 'Đủ hàng hóa' : 
                                            checkResults[detail.id]?.status === '2' ? 'Hư hỏng' : 
                                            checkResults[detail.id]?.status === '4' ? 'Đã trả hàng' : 'Thiếu'
                                        ) : (
                                            <Select
                                                fullWidth
                                                size="small"
                                                value={checkResults[detail.id]?.status || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'status', e.target.value)}
                                                sx={{ borderRadius: '8px' }}
                                            >
                                                <MenuItem value="1">Đủ hàng hóa</MenuItem>
                                                <MenuItem value="2">Hư hỏng</MenuItem>
                                                <MenuItem value="3">Thiếu</MenuItem>
                                            </Select>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {isReadOnly ? (
                                            checkResults[detail.id]?.production_date || ''
                                        ) : (
                                            <StyledInput
                                                type="date"
                                                value={checkResults[detail.id]?.production_date || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'production_date', e.target.value)}
                                                style={{ textAlign: 'center', margin: 'auto' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {isReadOnly ? (
                                            checkResults[detail.id]?.expiration_date || ''
                                        ) : (
                                            <StyledInput
                                                type="date"
                                                value={checkResults[detail.id]?.expiration_date || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'expiration_date', e.target.value)}
                                                style={{ textAlign: 'center', margin: 'auto' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '120px' }}>
                                        {isReadOnly ? (
                                            checkResults[detail.id]?.note || ''
                                        ) : (
                                            <StyledInput
                                                type="text"
                                                value={checkResults[detail.id]?.note || ''}
                                                onChange={(e) => handleCheckResultChange(detail.id, 'note', e.target.value)}
                                                placeholder="Ghi chú"
                                                style={{ width: '120px', textAlign: 'center', margin: 'auto' }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                <StyledButton onClick={handleCloseCheckDialog} variant="outlined">
                    {isReadOnly ? 'Đóng' : 'Hủy'}
                </StyledButton>
                {!isReadOnly && (
                    <StyledButton onClick={handleSubmitCheck} variant="contained" color="primary">
                        Lưu kết quả kiểm tra
                    </StyledButton>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CheckReceiptDialog;