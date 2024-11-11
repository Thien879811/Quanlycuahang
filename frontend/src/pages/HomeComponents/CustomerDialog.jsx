import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CustomerDialog = ({openCustomerDialog, handleCloseCustomerDialog, customerPhone, setCustomerPhone, handleSearchCustomer}) => {
    return (
        <Dialog 
        open={openCustomerDialog} 
        onClose={handleCloseCustomerDialog}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#ffffff'
            }
        }}
    >
        <DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Tìm Khách Hàng</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="phone"
                label="Số điện thoại"
                type="tel"
                fullWidth
                variant="outlined"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
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
                onClick={handleCloseCustomerDialog} 
                sx={{ 
                    borderRadius: '8px',
                    color: '#666'
                }}
            >
                Hủy
            </Button>
            <Button 
                onClick={handleSearchCustomer} 
                variant="contained"
                sx={{ 
                    borderRadius: '8px',
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                        backgroundColor: '#45a049'
                    }
                }}
            >
                Tìm kiếm
            </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDialog;