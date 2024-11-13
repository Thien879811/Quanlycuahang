import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button, Box } from '@mui/material';
import orderUtils from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';


const Pay = () => {
    const navigate = useNavigate();
    const [amountPaid, setAmountPaid] = useState('');
    const {
        orders,
        getTotalAmount,
        getTotalDiscount,
        updateOrder,
        clearOrder,   
    } = orderUtils();
    const [change, setChange] = useState(0);
    const {updatePointCustomer} = useCustomer();

    const finalAmount = getTotalAmount - getTotalDiscount - (orders?.discount ? orders.discount/100 * (getTotalAmount - getTotalDiscount) : 0);

    useEffect(() => {
        if (amountPaid) {
            const totalAmount = getTotalAmount - getTotalDiscount - (orders?.discount ? orders.discount/100 * (getTotalAmount - getTotalDiscount) : 0);
            setChange(parseFloat(amountPaid) - totalAmount);
        }
    }, [amountPaid, getTotalAmount, getTotalDiscount, orders]);

    const handlePayment = () => {
        
        const order_id = localStorage.getItem('order_id');
        const data = {
            ...orders,
            status: '1',
            pays_id: '1'
        };
        updateOrder(order_id, data);
        updatePointCustomer(getTotalAmount);
        localStorage.removeItem('order_id');
        localStorage.removeItem('customer');
        localStorage.removeItem('order');
        navigate('/');
    };

    const handleClearAmount = () => {
        setAmountPaid('');
        setChange(0);
    };

    const denominations = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];

    const handleDenominationClick = (value) => {
        setAmountPaid(prevAmount => {
            const newAmount = parseFloat(prevAmount || 0) + value;
            return newAmount.toString();
        });
    };

    const formatNumber = (number) => {
        return Math.floor(number/100) * 100;
    };

    return (
        <Grid container spacing={2} justifyContent="center" sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4 }}>
            <Grid item xs={12} md={8} lg={6}>
                <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 4 }}>
                        Thanh Toán Tiền Mặt
                    </Typography>
                    <Box sx={{ mb: 4, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                            Tổng cộng: {formatNumber(finalAmount).toLocaleString('vi-VN')} VNĐ
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Số tiền khách trả"
                            variant="outlined"
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    height: '56px',
                                    fontSize: '1.2rem'
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleClearAmount}
                            sx={{ height: '56px', width: '120px', fontSize: '1.1rem' }}
                        >
                            Xóa
                        </Button>
                    </Box>
                    <Box sx={{ mb: 4, p: 3, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                            Tiền thừa: {change.toLocaleString('vi-VN')} VNĐ
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {denominations.map((value) => (
                            <Grid item xs={4} key={value}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => handleDenominationClick(value)}
                                    sx={{
                                        height: '50px',
                                        fontSize: '1.1rem',
                                        borderColor: '#2196f3',
                                        color: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd',
                                            borderColor: '#1976d2'
                                        }
                                    }}
                                >
                                    {value.toLocaleString()} VND
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            onClick={() => navigate('/')}
                            sx={{ height: '56px', fontSize: '1.1rem' }}
                        >
                            Chọn phương thức thanh toán khác
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={handlePayment}
                            disabled={parseFloat(amountPaid) < finalAmount}
                            sx={{ 
                                height: '56px', 
                                fontSize: '1.1rem',
                                backgroundColor: '#2e7d32',
                                '&:hover': {
                                    backgroundColor: '#1b5e20'
                                }
                            }}
                        >
                            Xác nhận thanh toán
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Pay;
