import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Autocomplete } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; 
import InventoryIcon from '@mui/icons-material/Inventory';

export default function EditReceiptDialog({ open, onClose, receipt, onSave }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chỉnh sửa phiếu nhập hàng</DialogTitle>
            <DialogContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={suppliers}
                                getOptionLabel={(option) => option.factory_name}
                                renderInput={(params) => 
                                    <TextField 
                                        {...params} 
                                        label="Nhà cung cấp" 
                                        required 
                                        variant="outlined"
                                        fullWidth
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                            minWidth: '400px'
                                        }}
                                    />
                                }
                                onChange={(_, newValue) => setSelectedSupplier(newValue)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Ngày nhập"
                                type="date"
                                fullWidth
                                required
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={importDate}
                                onChange={(e) => setImportDate(e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 5, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InventoryIcon color="primary" fontSize="large" />
                        <Typography variant="h5" color="primary" fontWeight="bold">
                            Danh sách sản phẩm nhập
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: theme.palette.primary }}>
                                    <TableCell width="40%" sx={{ color: 'dark', fontWeight: 'bold' }}>Sản phẩm</TableCell>
                                    <TableCell width="20%" sx={{ color: 'dark', fontWeight: 'bold' }}>Số lượng</TableCell>
                                    <TableCell width="20%" sx={{ color: 'dark', fontWeight: 'bold' }}>Giá nhập</TableCell>
                                    <TableCell width="20%" sx={{ color: 'dark', fontWeight: 'bold' }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedProducts.map((item, index) => (
                                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f9f9f9' } }}>
                                        <TableCell>
                                            <Autocomplete
                                                options={products.filter(product => !selectedProducts.some(selected => selected.product?.id === product.id))}
                                                getOptionLabel={(option) => option.product_name}
                                                renderInput={(params) => 
                                                    <TextField 
                                                        {...params} 
                                                        required 
                                                        variant="outlined"
                                                        size="small"
                                                        sx={{ 
                                                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                                            minWidth: '300px'
                                                        }}
                                                    />
                                                }
                                                onChange={(_, newValue) => handleProductChange(index, 'product', newValue)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                required
                                                variant="outlined"
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                                required
                                                variant="outlined"
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                onClick={() => handleRemoveProduct(index)}
                                                color="error"
                                                sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddProduct}
                            color="primary"
                            sx={{ 
                                borderRadius: 2,
                                px: 3,
                                '&:hover': { transform: 'translateY(-2px)' },
                                transition: 'transform 0.2s'
                            }}
                        >
                            Thêm sản phẩm
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ 
                                borderRadius: 2,
                                px: 4,
                                '&:hover': { transform: 'translateY(-2px)' },
                                transition: 'transform 0.2s'
                            }}
                        >
                            Tạo phiếu nhập
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}