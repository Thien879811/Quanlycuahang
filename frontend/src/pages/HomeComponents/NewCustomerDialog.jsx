import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const NewCustomerDialog = ({openNewCustomerDialog, handleCloseNewCustomerDialog, newCustomerName, setNewCustomerName, handleCreateNewCustomer, customerPhone}) => {
    return (
        <Dialog 
            open={openNewCustomerDialog} 
            onClose={handleCloseNewCustomerDialog}
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    padding: '16px',
                    backgroundColor: '#ffffff'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600, color: '#1976d2' }}>Tạo Khách Hàng Mới</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Tên khách hàng"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    sx={{ 
                        mt: 2,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                />
                <TextField
                    margin="dense"
                    id="phone"
                    label="Số điện thoại"
                    type="tel"
                    fullWidth
                    variant="outlined"
                    value={customerPhone}
                    disabled
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
                    onClick={handleCloseNewCustomerDialog} 
                    sx={{ 
                        borderRadius: '8px',
                        color: '#666'
                    }}
                >
                    Hủy
                </Button>
                <Button 
                    onClick={handleCreateNewCustomer} 
                    variant="contained"
                    sx={{ 
                        borderRadius: '8px',
                        backgroundColor: '#4CAF50',
                        '&:hover': {
                            backgroundColor: '#45a049'
                        }
                    }}
                >
                    Tạo mới
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewCustomerDialog;