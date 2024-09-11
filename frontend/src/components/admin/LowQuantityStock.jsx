import React from 'react';
import { Card, List, Avatar, Tag } from 'antd';

const LowQuantityStock = () => {
  const data = [
    {
      title: 'Tata Salt',
      avatar: 'https://example.com/tata-salt.jpg',
      description: 'Remaining Quantity : 10 Packet',
    },
    {
      title: 'Lays',
      avatar: 'https://example.com/lays.jpg',
      description: 'Remaining Quantity : 15 Packet',
    },
    {
      title: 'Lays',
      avatar: 'https://example.com/lays.jpg',
      description: 'Remaining Quantity : 15 Packet',
    },
  ];

  return (
    <Card title="Low Quantity Stock" extra={<a href="#">See All</a>}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item extra={<Tag color="red">Low</Tag>}>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default LowQuantityStock;
