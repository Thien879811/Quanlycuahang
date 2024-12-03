import React from 'react';
import { Card, Table } from 'antd';

const TopSellingStock = ({ topSellingStock }) => {
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'soldQuantity', 
      key: 'soldQuantity',
    },
    {
      title: 'Số lượng còn lại',
      dataIndex: 'remainingQuantity',
      key: 'remainingQuantity',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${price.toLocaleString('vi-VN')} ₫` : '-',
    },
  ];

  const data = topSellingStock.map((item, index) => ({
    key: index + 1,
    name: item.name,
    soldQuantity: item.soldQuantity,
    remainingQuantity: item.remainingQuantity,
    price: item.price,
  }));  

  return (
    <Card title="Sản phẩm bán chạy">
      <Table columns={columns} dataSource={data} pagination={false} />
    </Card>
  );
};

export default TopSellingStock;
