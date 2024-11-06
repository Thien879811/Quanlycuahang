import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrderSummaryChart = ({orderSummary = {}}) => {
    const orderData = [
        { name: 'Th1', orders: orderSummary?.jan || 0 },
        { name: 'Th2', orders: orderSummary?.feb || 0 }, 
        { name: 'Th3', orders: orderSummary?.mar || 0 },
        { name: 'Th4', orders: orderSummary?.apr || 0 },
        { name: 'Th5', orders: orderSummary?.may || 0 },
        { name: 'Th6', orders: orderSummary?.jun || 0 },
        { name: 'Th7', orders: orderSummary?.jul || 0 },
        { name: 'Th8', orders: orderSummary?.aug || 0 },
        { name: 'Th9', orders: orderSummary?.sep || 0 },
        { name: 'Th10', orders: orderSummary?.oct || 0 },
        { name: 'Th11', orders: orderSummary?.nov || 0 },
        { name: 'Th12', orders: orderSummary?.dec || 0 },
    ];

    return (
        <Card title="Tổng quan đơn hàng">
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" name="Đơn hàng" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
        </Card>
    );
};

export default OrderSummaryChart;
