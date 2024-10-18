import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, TextField, Button, Box } from '@mui/material';
import useOrder from '../utils/orderUtils';
import useCustomer from '../utils/customerUtils';
import useOrderProduct from '../utils/orderproduct';

const Pay = () => {
    const navigate = useNavigate();
    const [amountPaid, setAmountPaid] = useState('');
    const {getTotalAmount} = useOrderProduct();
    const [change, setChange] = useState(0);
    const {updateOrder,clearOrder} = useOrder();
    const [totalAmount] = useState(getTotalAmount());
    const {updatePointCustomer} = useCustomer();

    useEffect(() => {
        if (amountPaid) {
            setChange(parseFloat(amountPaid) - totalAmount);
        }
    }, [amountPaid, totalAmount]);

    const handlePayment = () => {
        const order_id = localStorage.getItem('order_id');
        const status = '1';
        const pays_id = '1';
        updateOrder(order_id, status, pays_id);
        updatePointCustomer(totalAmount);
        clearOrder();
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

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Thanh Toán Tiền Mặt
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">
                            Tổng cộng: {totalAmount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Số tiền khách trả"
                            variant="outlined"
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            sx={{ mr: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClearAmount}
                            sx={{ height: '56px' }} // Adjusting the height to match the input field
                        >
                            Xóa
                        </Button>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">
                            Tiền thừa: {change}
                        </Typography>
                    </Box>
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                        {denominations.map((value) => (
                            <Grid item xs={4} key={value}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => handleDenominationClick(value)}
                                >
                                    {value.toLocaleString()} VND
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate('/')}
                        sx={{ mb: 2 }}
                    >
                        Chọn phương thức thanh toán khác
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() =>handlePayment()}
                        disabled={parseFloat(amountPaid) < totalAmount}
                        sx={{ mb: 2 }}
                    >
                        Xác nhận thanh toán
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Pay;
