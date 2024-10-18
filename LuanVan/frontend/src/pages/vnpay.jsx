import React from 'react';
import { useState, useEffect } from 'react';
import useOrder from '../utils/orderUtils'
import VnpayService from '../services/vnpay';
import { handleResponse } from '../functions';
import { Spin } from 'antd';

const Vnpay = () => {
    const { tonghoadon } = useOrder();
    const [isLoading, setIsLoading] = useState(true);

    const order_id = localStorage.getItem('order_id');

    const getUrlAndRedirect = async () => {
        const data = {
            order_id: order_id,
            amount: tonghoadon
        };
        try {
            const res = await VnpayService.vnpay(data);
            const url = handleResponse(res);
            console.log(url);
            window.location.href = url.url;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUrlAndRedirect();
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return null;
};

export default Vnpay;