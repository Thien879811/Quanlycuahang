import React from 'react';
import { Card, Table } from 'antd';

const TopSellingStock = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sold Quantity',
      dataIndex: 'soldQuantity',
      key: 'soldQuantity',
    },
    {
      title: 'Remaining Quantity',
      dataIndex: 'remainingQuantity',
      key: 'remainingQuantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹ ${price}`,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'Surf Excel',
      soldQuantity: 30,
      remainingQuantity: 12,
      price: 100,
    },
    {
      key: '2',
      name: 'Rin',
      soldQuantity: 21,
      remainingQuantity: 15,
      price: 207,
    },
    {
      key: '3',
      name: 'Parle G',
      soldQuantity: 19,
      remainingQuantity: 17,
      price: 105,
    },
  ];

  return (
    <Card title="Top Selling Stock" extra={<a href="#">See All</a>}>
      <Table columns={columns} dataSource={data} pagination={false} />
    </Card>
  );
};

export default TopSellingStock;
