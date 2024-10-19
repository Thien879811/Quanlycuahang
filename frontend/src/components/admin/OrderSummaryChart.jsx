import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrderSummaryChart = () => {
    const orderData = [
        { name: 'Jan', orders: 400 },
        { name: 'Feb', orders: 300 },
        { name: 'Mar', orders: 200 },
        { name: 'Apr', orders: 278 },
        { name: 'May', orders: 189 },
        { name: 'Jun', orders: 239 },
    ];

    return (
        <Card title="Order Summary">
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>
        </Card>
    );
};

export default OrderSummaryChart;
