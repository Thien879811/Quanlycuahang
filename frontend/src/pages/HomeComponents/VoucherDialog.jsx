import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const VoucherDialog = ({openVoucherDialog, handleCloseVoucherDialog, voucherCodeInput, setVoucherCodeInput, handleVoucherSubmit}) => {
    return (
        <Dialog 
            open={openVoucherDialog} 
            onClose={handleCloseVoucherDialog}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#ffffff'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Nhập E-Voucher</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="voucher"
                    label="Mã E-Voucher"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value)}
                    sx={{ 
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleCloseVoucherDialog} 
                    sx={{ 
                        borderRadius: '8px',
                        color: '#666'
                    }}
                >
                    Hủy
                </Button>
                <Button 
                    onClick={handleVoucherSubmit} 
                    variant="contained"
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: '#4CAF50',
                        '&:hover': {
                            backgroundColor: '#45a049'
                        }
                    }}
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VoucherDialog;
