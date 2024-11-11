import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import orderUtils from '../utils/orderUtils';
import VnpayService from '../services/vnpay';
import { handleResponse } from '../functions';
import { Spin } from 'antd';

const Vnpay = () => {

    const { id, amount } = useParams();
    
    const [isLoading, setIsLoading] = useState(true);

    const getUrlAndRedirect = async () => {
        // Prepare payment data with parsed amount
        const paymentData = {
            order_id: id,
            amount: parseInt(amount, 10)  // Parse amount to integer
        };
        console.log(paymentData);
        try {
            // Call VNPAY service to get payment URL
            const response = await VnpayService.vnpay(paymentData);
            const { url } = handleResponse(response);
            
            // Redirect to VNPAY payment page
            window.location.href = url;
        } catch (error) {
            console.error('VNPAY payment error:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializePayment = async () => {
            try {
                await getUrlAndRedirect();
            } catch (error) {
                console.error('Payment initialization error:', error);
                setIsLoading(false);
            }
        };
        
        initializePayment();
    }, []);

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return null;
};

export default Vnpay;