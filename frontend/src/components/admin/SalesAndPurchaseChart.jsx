import React from 'react';
import { Card, Switch } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesAndPurchaseChart = ({data}) => {
  // const data = [
  //   { name: 'Th1', purchase: 55000, sales: 49000 },
  //   { name: 'Th2', purchase: 57000, sales: 48000 },
  //   { name: 'Th3', purchase: 45000, sales: 52000 },
  //   { name: 'Th4', purchase: 37000, sales: 43000 },
  //   { name: 'Th5', purchase: 43000, sales: 46000 },
  //   { name: 'Th6', purchase: 28000, sales: 41000 },
  //   { name: 'Th7', purchase: 54000, sales: 49000 },
  //   { name: 'Th8', purchase: 45000, sales: 42000 },
  //   { name: 'Th9', purchase: 44000, sales: 44000 },
  //   { name: 'Th10', purchase: 37000, sales: 43000 },
  // ];

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
