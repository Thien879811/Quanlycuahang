import React, { useState } from 'react';
import { Card, List, Avatar, Tag, Modal } from 'antd';
import { API_URL } from '../../services/config';

const LowQuantityStock = ({lowQuantityStock}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Card title="Sản phẩm sắp hết hàng" extra={<a onClick={showModal}>Xem tất cả</a>}>
        <List
          itemLayout="horizontal"
          dataSource={lowQuantityStock.slice(0, 5)}
          renderItem={(item) => (
            <List.Item extra={<Tag color="red">Sắp hết</Tag>}>
              <List.Item.Meta
                avatar={<Avatar src={`${API_URL}${item.avatar}`} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Tất cả sản phẩm sắp hết hàng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <List
          itemLayout="horizontal"
          dataSource={lowQuantityStock}
          renderItem={(item) => (
            <List.Item extra={<Tag color="red">Sắp hết</Tag>}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default LowQuantityStock;
