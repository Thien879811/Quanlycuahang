import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button } from '@mui/material';

const InfoCustomerDialog = ({openInfoCustomerDialog, handleCloseInfoCustomerDialog, customer}) => {
    return (
        <Dialog 
            open={openInfoCustomerDialog} 
            onClose={handleCloseInfoCustomerDialog}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#ffffff'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Thông tin Khách Hàng</DialogTitle>
            <DialogContent>
                {customer && (
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>Tên: {customer.name}</Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>Số điện thoại: {customer.phone}</Typography>
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>Điểm tích lũy: {customer.diem}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleCloseInfoCustomerDialog} 
                    variant="contained"
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: '#4CAF50',
                        '&:hover': {
                            backgroundColor: '#45a049'
                        }
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoCustomerDialog;

