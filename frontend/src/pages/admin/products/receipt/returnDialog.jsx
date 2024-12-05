import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from '@mui/material';

const ReturnDialog = ({ openReturnDialog, setOpenReturnDialog, selectedReceipt, selectedProducts, handleSubmitReturn, setSelectedProducts, setReturnQuantities, setReturnReason ,returnReason,returnQuantities}) => {
    const handleProductSelect = (detail) => {
        if (selectedProducts.includes(detail.id)) {
            setSelectedProducts(selectedProducts.filter(id => id !== detail.id));
        } else {
            setSelectedProducts([...selectedProducts, detail.id]);
        }
    };

    const handleReturnQuantityChange = (detailId, value) => {
        const quantity = parseInt(value) || '';
        const detail = selectedReceipt?.details?.find(d => d.id === detailId);
        
        if (quantity > detail?.quantity) {
            alert(`Số lượng trả không được lớn hơn số lượng nhập (${detail?.quantity})`);
            return;
        }
        
        if (quantity > 0) {
            setReturnQuantities(prev => ({
                ...prev,
                [detailId]: quantity
            }));
        }
    };

    // Filter out products with status '4' before rendering
    const availableProducts = selectedReceipt?.details?.filter(detail => detail.status !== 'Đã trả hàng') || [];

    return (
        <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Trả hàng - Phiếu nhập #{selectedReceipt?.id}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Chọn sản phẩm cần trả:
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts(availableProducts.map(d => d.id));
                                                } else {
                                                    setSelectedProducts([]);
                                                }
                                            }}
                                            checked={selectedProducts.length === availableProducts.length && availableProducts.length > 0}
                                        />
                                    </TableCell>
                                    <TableCell>Sản phẩm</TableCell>
                                    <TableCell align="right">Số lượng đã nhập</TableCell>
                                    <TableCell align="right">Số lượng đã lưu hệ thống</TableCell>
                                    <TableCell align="right">Số lượng lỗi hoặc hư hỏng</TableCell>
                                    <TableCell align="right">Số lượng trả</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {availableProducts.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedProducts.includes(detail.id)}
                                                onChange={() => handleProductSelect(detail)}
                                            />
                                        </TableCell>
                                        <TableCell>{detail.product?.product_name}</TableCell>
                                        <TableCell align="right">{detail.quantity}</TableCell>
                                        <TableCell align="right">{detail.quantity}</TableCell>
                                        <TableCell align="right">{detail.quantity_defective}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={returnQuantities[detail.id] || ''}
                                                onChange={(e) => {
                                                    handleReturnQuantityChange(detail.id, e.target.value);
                                                }}
                                                error={returnQuantities[detail.id] > detail.quantity}
                                                helperText={returnQuantities[detail.id] > detail.quantity ? "Số lượng trả không được lớn hơn số lượng nhập" : ""}
                                                inputProps={{ 
                                                    min: 1,
                                                    max: detail.quantity,
                                                    step: 1
                                                }}
                                                disabled={!selectedProducts.includes(detail.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TextField
                        fullWidth
                        label="Lý do trả hàng"
                        multiline
                        rows={4}
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenReturnDialog(false)}>Hủy</Button>
                <Button 
                    onClick={handleSubmitReturn} 
                    variant="contained" 
                    color="primary"
                    disabled={
                        selectedProducts.length === 0 || 
                        !returnReason || 
                        selectedProducts.some(id => returnQuantities[id] > selectedReceipt?.details?.find(d => d.id === id)?.quantity)
                    }
                >
                    Xác nhận trả hàng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReturnDialog;
