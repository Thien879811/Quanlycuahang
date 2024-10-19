import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Modal, List, Input, Form } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import useCatalogs from '../../../utils/catalogUtils';
import useProducts from '../../../utils/productUtils';

const { Text } = Typography;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
`;

const StatisticCard = ({ title, value1, value2, subLabel1, subLabel2, titleColor, showViewButton, onViewClick }) => (
  <Col span={6}>
    <Card bodyStyle={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <Text strong style={{ color: titleColor, fontSize: '16px', fontWeight: 600 }}>
          {title}
        </Text>
        {showViewButton && (
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={onViewClick}>
            Xem
          </Button>
        )}
      </div>
      <Row gutter={16} align="bottom">
        <Col>
          <Text style={{ fontSize: '24px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            {value1}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', fontWeight: 300 }}>
            {subLabel1}
          </Text>
        </Col>
        {value2 && (
          <Col>
            <Text style={{ fontSize: '24px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              {value2}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 300 }}>
              {subLabel2}
            </Text>
          </Col>
        )}
      </Row>
    </Card>
  </Col>
);

const OverallInventory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {catalogs, fetchCatalogs, createCatalog } = useCatalogs();
  const { products } = useProducts();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddCategory = (values) => {
    createCatalog(values);
    fetchCatalogs();
    form.resetFields();
  };

  return (
    <div>
      <GlobalStyle />
      <Row gutter={16}>
        <StatisticCard
          title="Danh mục"
          value1={catalogs.length}
          subLabel1="7 ngày qua"
          titleColor="#1890ff"
          showViewButton={true}
          onViewClick={showModal}
        />
        <StatisticCard
          title="Tổng sản phẩm"
          value1={products.length}
          //value2="₹25000"
          subLabel1="7 ngày qua"
          subLabel2="Doanh thu"
          titleColor="#ffa940"
        />
        <StatisticCard
          title="Bán chạy nhất"
          value1="5"
          value2="₹2500"
          subLabel1="7 ngày qua"
          subLabel2="Chi phí"
          titleColor="#73d13d"
        />
        <StatisticCard
          title="Hàng tồn thấp"
          value1="12"
          value2="2"
          subLabel1="Đã đặt hàng"
          subLabel2="Hết hàng"
          titleColor="#ff4d4f"
        />
      </Row>
      <Modal 
        title="Danh sách danh mục" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        <List
          bordered
          dataSource={catalogs}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item.catalogy_name}</Typography.Text>
            </List.Item>
          )}
        />
        <Form form={form} onFinish={handleAddCategory} style={{ marginTop: '20px' }}>
          <Form.Item
            name="catalogy_name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục mới" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Thêm danh mục
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OverallInventory;
