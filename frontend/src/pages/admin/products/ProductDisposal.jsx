import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip
} from '@mui/material';
import productService from '../../../services/product.service';
import { handleResponse } from '../../../functions';
import dayjs from 'dayjs';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

const ProductDisposal = () => {
    const [disposalRequests, setDisposalRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [approvalNote, setApprovalNote] = useState('');

    useEffect(() => {
        loadDisposalRequests();
    }, []);

    const loadDisposalRequests = async () => {
        try {
            const response = await productService.getDestroyProduct();
            const data = handleResponse(response);
            setDisposalRequests(data);
        } catch (error) {
            console.error('Error loading disposal requests:', error);
        }
    };

    const handleOpenDialog = (request) => {
        setSelectedRequest(request);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedRequest(null);
        setOpenDialog(false);
        setApprovalNote('');
    };

    const handleApprove = async () => {
        try {
            const formData = new FormData();
            formData.append('status', 'approved');
            formData.append('note', approvalNote);

            await productService.updateDestroyProductStatus(selectedRequest.id, formData);
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error approving disposal request:', error);
        }
    };

    const handleReject = async () => {
        try {
            const formData = new FormData();
            formData.append('status', 'rejected'); 
            formData.append('note', approvalNote);
            await productService.updateDestroyProductStatus(selectedRequest.id, formData);
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error rejecting disposal request:', error);
        }
    };

    const getStatusChip = (status) => {
        let color = 'default';
        let icon = <PendingIcon />;
        let label = 'Chờ xử lý';

        switch(status) {
            case 'approved':
                color = 'success';
                icon = <CheckCircleIcon />;
                label = 'Đã duyệt';
                break;
            case 'rejected':
                color = 'error';
                icon = <CancelIcon />;
                label = 'Đã từ chối';
                break;
            case 'pending':
                color = 'warning';
                icon = <PendingIcon />;
                label = 'Chờ xử lý';
                break;
            default:
                break;
        }

        return (
            <Chip
                icon={icon}
                label={label}
                color={color}
                size="small"
            />
        );
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
                Xác nhận yêu cầu hủy sản phẩm
            </Typography>

            <Paper sx={{ width: '100%', mb: 4, borderRadius: 2, overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Mã yêu cầu</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Sản phẩm</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Số lượng</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Lý do</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Ngày tạo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {disposalRequests.map((request) => (
                                <TableRow 
                                    key={request.id}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.product?.product_name || 'N/A'}</TableCell>
                                    <TableCell>{request.quantity}</TableCell>
                                    <TableCell sx={{ color: 'dark', maxWidth: 200, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {request.note}
                                    </TableCell>
                                    <TableCell>{dayjs(request.created_at).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell>{getStatusChip(request.status)}</TableCell>
                                    <TableCell>
                                        {(request.status === 'pending' || request.status === 'PENDING' || !request.status || request.status === '0') && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleOpenDialog(request)}
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Xem xét
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="sm" 
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                    Xem xét yêu cầu hủy sản phẩm
                </DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ mb: 1 }}>
                                <strong>Sản phẩm:</strong> {selectedRequest.product?.product_name || 'N/A'}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                <strong>Số lượng:</strong> {selectedRequest.quantity}
                            </Typography>
                            <Typography sx={{ mb: 2 }}>
                                <strong>Lý do:</strong> {selectedRequest.note}
                            </Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Ghi chú phê duyệt"
                                multiline
                                rows={3}
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                                variant="outlined"
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleReject} 
                        color="error" 
                        variant="contained"
                        sx={{ textTransform: 'none', ml: 1 }}
                    >
                        Từ chối
                    </Button>
                    <Button 
                        onClick={handleApprove} 
                        color="success" 
                        variant="contained"
                        sx={{ textTransform: 'none', ml: 1 }}
                    >
                        Phê duyệt
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductDisposal;
