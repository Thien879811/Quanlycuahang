import React from 'react';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { 
    TableContainer, 
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Chip,
    TablePagination,
    Typography,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

const ReceiptTable = ({
    displayedReceipts,
    handleOpenCheckDialog,
    page,
    handleChangePage,
    rowsPerPage,
    filteredReceipts
}) => {
    return(
        <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Mã phiếu</StyledTableCell>
                        <StyledTableCell>Ngày nhập</StyledTableCell>
                        <StyledTableCell>Nhà cung cấp</StyledTableCell>
                        <StyledTableCell>Thời gian kiểm tra</StyledTableCell>
                        <StyledTableCell>Trạng thái</StyledTableCell>
                        <StyledTableCell align="center">Thao tác</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedReceipts.map((receipt) => (
                        <TableRow 
                            key={receipt.id}
                            hover
                            sx={{ 
                                '&:hover': { backgroundColor: '#f5f5f5' },
                                backgroundColor: receipt.details.some(detail => detail.status === 'Hư hỏng') ? '#ffebee' : 'inherit'
                            }}
                        >
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    #{receipt.id}
                                </Typography>
                            </TableCell>
                            <TableCell>{new Date(receipt.import_date).toLocaleDateString('vi-VN')}</TableCell>
                            <TableCell>{receipt.supplier?.factory_name || 'N/A'}</TableCell>
                            <TableCell>
                                {receipt.check_date ? 
                                    dayjs(receipt.check_date).format('DD/MM/YYYY HH:mm:ss') : 
                                    <Typography color="text.secondary">Chưa kiểm tra</Typography>
                                }
                            </TableCell>
                            <TableCell>
                                <Chip
                                    icon={receipt.status === 'Đã kiểm tra' ? <CheckCircleIcon /> : <WarningIcon />}
                                    label={receipt.status}
                                    color={receipt.status === 'Đã kiểm tra' ? 'success' : 'warning'}
                                    sx={{ borderRadius: '8px' }}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenCheckDialog(receipt)}
                                    size="small"
                                >
                                    Kiểm tra hàng
                                </StyledButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={filteredReceipts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[50]}
                sx={{ borderTop: '1px solid #e0e0e0' }}
            />
        </TableContainer>
    );
};

export default ReceiptTable;