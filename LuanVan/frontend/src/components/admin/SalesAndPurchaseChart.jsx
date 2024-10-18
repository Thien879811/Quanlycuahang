import React from 'react';
import { Card, Switch } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesAndPurchaseChart = () => {
  const data = [
    { name: 'Jan', purchase: 55000, sales: 49000 },
    { name: 'Feb', purchase: 57000, sales: 48000 },
    { name: 'Mar', purchase: 45000, sales: 52000 },
    { name: 'Apr', purchase: 37000, sales: 43000 },
    { name: 'May', purchase: 43000, sales: 46000 },
    { name: 'Jun', purchase: 28000, sales: 41000 },
    { name: 'Jul', purchase: 54000, sales: 49000 },
    { name: 'Aug', purchase: 45000, sales: 42000 },
    { name: 'Sep', purchase: 44000, sales: 44000 },
    { name: 'Oct', purchase: 37000, sales: 43000 },
  ];

  return (
    <Card 
      title="Sales & Purchase" 
      extra={<Switch checkedChildren="Weekly" unCheckedChildren="Monthly" defaultChecked />}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={10} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="purchase" fill="#69b1ff" radius={[5, 5, 0, 0]} />
          <Bar dataKey="sales" fill="#4cd964" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesAndPurchaseChart;
