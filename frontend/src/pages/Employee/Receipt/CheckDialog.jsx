import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Typography,
    Grid,
    Box,
    Select,
    MenuItem,
    Chip,
    Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Button, TextField } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(3)
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }
}));

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

const SearchTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        backgroundColor: '#fff',
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));


const CheckDialog = ({ openDialog, handleCloseCheckDialog, selectedReceipt, checkResults, handleCheckResultChange, handleSubmitCheck, checkTime, validationErrors }) => {
    return (
        <Dialog
                open={openDialog}
                onClose={handleCloseCheckDialog}
                maxWidth="xl"
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
                                Kiểm tra hàng - Phiếu nhập #{selectedReceipt?.id}
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
                                    <StyledTableCell align="center">Số lượng lỗi hoặc thiếu</StyledTableCell>
                                    <StyledTableCell align="center">Trạng thái</StyledTableCell>
                                    <StyledTableCell align="center">Ngày sản xuất</StyledTableCell>
                                    <StyledTableCell align="center">Hạn sử dụng</StyledTableCell>
                                    <StyledTableCell align="center">Ghi chú</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedReceipt?.details?.map((detail) => (
                                    detail.status !== 'Đã hủy' && (
                                        <TableRow key={detail.id}>
                                            <TableCell>{detail.product?.product_name || 'N/A'}</TableCell>
                                            <TableCell align="center">{detail.quantity}</TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <StyledInput
                                                            type="number"
                                                            value={checkResults[detail.id]?.quantity_receipt || ''}
                                                            onChange={(e) => handleCheckResultChange(detail.id, 'quantity_receipt', e.target.value)}
                                                            min={0}
                                                            max={detail.quantity}
                                                            required
                                                            style={{ 
                                                                textAlign: 'center',
                                                                borderColor: validationErrors[detail.id]?.quantity_receipt ? 'red' : undefined,
                                                                margin: 'auto'
                                                            }}
                                                        />
                                                        {validationErrors[detail.id]?.quantity_receipt && (
                                                            <Typography color="error" variant="caption" display="block">
                                                                {validationErrors[detail.id].quantity_receipt}
                                                            </Typography>
                                                        )}
                                                        {validationErrors[detail.id]?.required && (
                                                            <Typography color="error" variant="caption" display="block">
                                                                {validationErrors[detail.id].required}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && 
                                                 (checkResults[detail.id]?.status === '2' || checkResults[detail.id]?.status === '3') && (
                                                    <Box>
                                                        <StyledInput
                                                            type="number"
                                                            value={checkResults[detail.id]?.quantity_defective || ''}
                                                            onChange={(e) => handleCheckResultChange(detail.id, 'quantity_defective', e.target.value)}
                                                            min={0}
                                                            max={detail.quantity}
                                                            style={{ 
                                                                textAlign: 'center',
                                                                borderColor: validationErrors[detail.id]?.quantity_defective ? 'red' : undefined 
                                                            }}
                                                        />
                                                        {validationErrors[detail.id]?.quantity_defective && (
                                                            <Typography color="error" variant="caption" display="block">
                                                                {validationErrors[detail.id].quantity_defective}
                                                            </Typography>
                                                        )}
                                                        {validationErrors[detail.id]?.total && (
                                                            <Typography color="error" variant="caption" display="block">
                                                                {validationErrors[detail.id].total}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') ? (
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
                                                ) : (
                                                    <Chip
                                                        label={detail.status}
                                                        color={
                                                            detail.status === 'Đủ hàng hóa' ? 'success' :
                                                            detail.status === 'Hư hỏng' ? 'error' :
                                                            'warning'
                                                        }
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        style={{ margin: 'auto' }}
                                                        type="date"
                                                        value={checkResults[detail.id]?.production_date || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'production_date', e.target.value)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        style={{ margin: 'auto' }}
                                                        type="date"
                                                        value={checkResults[detail.id]?.expiration_date || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'expiration_date', e.target.value)}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {(detail.status === '0' || detail.status === 'Chưa kiểm tra') && (
                                                    <StyledInput
                                                        style={{ margin: 'auto' }}
                                                        type="text"
                                                        value={checkResults[detail.id]?.note || ''}
                                                        onChange={(e) => handleCheckResultChange(detail.id, 'note', e.target.value)}
                                                        placeholder="Ghi chú"
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                    <StyledButton onClick={handleCloseCheckDialog} variant="outlined">
                        Hủy
                    </StyledButton>
                    <StyledButton onClick={handleSubmitCheck} variant="contained" color="primary">
                        Lưu kết quả kiểm tra
                    </StyledButton>
                </DialogActions>
            </Dialog>
    );
};

export default CheckDialog;

