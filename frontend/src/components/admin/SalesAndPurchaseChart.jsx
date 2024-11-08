import React from 'react';
import { Card, Switch } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesAndPurchaseChart = ({data}) => {

  return (
    <Card 
      title="Mua bán hàng" 
    //  extra={<Switch checkedChildren="Tuần" unCheckedChildren="Tháng" defaultChecked />}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={10} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="purchase" name="Mua vào" fill="#69b1ff" radius={[5, 5, 0, 0]} />
          <Bar dataKey="sales" name="Bán ra" fill="#4cd964" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesAndPurchaseChart;
