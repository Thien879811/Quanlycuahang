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
    TextField
} from '@mui/material';
import axiosClient from '../../../axios-client';

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
            const response = await axiosClient.get('/api/disposal-requests');
            setDisposalRequests(response.data);
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
            await axiosClient.put(`/api/disposal-requests/${selectedRequest.id}/approve`, {
                note: approvalNote
            });
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error approving disposal request:', error);
        }
    };

    const handleReject = async () => {
        try {
            await axiosClient.put(`/api/disposal-requests/${selectedRequest.id}/reject`, {
                note: approvalNote
            });
            loadDisposalRequests();
            handleCloseDialog();
        } catch (error) {
            console.error('Error rejecting disposal request:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
                Xác nhận yêu cầu hủy sản phẩm
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã yêu cầu</TableCell>
                                <TableCell>Sản phẩm</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Lý do</TableCell>
                                <TableCell>Người yêu cầu</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {disposalRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.product_name}</TableCell>
                                    <TableCell>{request.quantity}</TableCell>
                                    <TableCell>{request.reason}</TableCell>
                                    <TableCell>{request.requester_name}</TableCell>
                                    <TableCell>{request.status}</TableCell>
                                    <TableCell>
                                        {request.status === 'pending' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenDialog(request)}
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

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Xem xét yêu cầu hủy sản phẩm</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ mt: 2 }}>
                            <Typography><strong>Sản phẩm:</strong> {selectedRequest.product_name}</Typography>
                            <Typography><strong>Số lượng:</strong> {selectedRequest.quantity}</Typography>
                            <Typography><strong>Lý do:</strong> {selectedRequest.reason}</Typography>
                            <Typography><strong>Ghi chú:</strong> {selectedRequest.note}</Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Ghi chú phê duyệt"
                                multiline
                                rows={3}
                                value={approvalNote}
                                onChange={(e) => setApprovalNote(e.target.value)}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleReject} color="error">
                        Từ chối
                    </Button>
                    <Button onClick={handleApprove} color="primary" variant="contained">
                        Phê duyệt
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductDisposal;
