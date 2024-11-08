import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Modal, List, Input, Form } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import useCatalogs from '../../../utils/catalogUtils';
import useProducts from '../../../utils/productUtils';
import dashboardService from '../../../services/dashboard.service';

const { Text } = Typography;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
`;

const StatisticCard = ({ title, value1, value2, subLabel1, subLabel2, titleColor, showViewButton, onViewClick }) => (
  <Col span={8}>
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
  const [isOutOfStockModalVisible, setIsOutOfStockModalVisible] = useState(false);
  const { catalogs, fetchCatalogs, createCatalog } = useCatalogs();
  const { products } = useProducts();
  const [form] = Form.useForm();
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    fetchPurchaseData();
  }, []);

  const handleResponse = (response, setter) => {
    if (response && response.data) {
      setter(response.data);
    }
  };

  const fetchPurchaseData = async () => {
    const response = await dashboardService.getPurchaseData('today');
    handleResponse(response, setPurchaseData);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const showOutOfStockModal = () => {
    setIsOutOfStockModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOutOfStockCancel = () => {
    setIsOutOfStockModalVisible(false);
  };

  const handleAddCategory = async (values) => {
    await createCatalog(values);
    await fetchCatalogs();
    form.resetFields();
    handleCancel();
  };

  const getOutOfStockCount = () => {
    return products?.filter(product => product.quantity === 0).length || 0;
  };

  const getOutOfStockProducts = () => {
    return products?.filter(product => product.quantity === 0) || [];
  };

  return (
    <div>
      <GlobalStyle />
      <Row gutter={16}>
        <StatisticCard
          title="Danh mục"
          value1={catalogs?.length || 0}
          subLabel1="7 ngày qua"
          titleColor="#1890ff"
          showViewButton={true}
          onViewClick={showModal}
        />
        <StatisticCard
          title="Tổng sản phẩm"
          value1={products?.length || 0}
          subLabel1="7 ngày qua"
          subLabel2="Doanh thu"
          titleColor="#ffa940"
        />
        <StatisticCard
          title="Sản phẩm đã hết"
          value1={getOutOfStockCount()}
          subLabel1="Sản phẩm"
          titleColor="#ff4d4f"
          showViewButton={true}
          onViewClick={showOutOfStockModal}
        />
      </Row>
      <Modal 
        title="Danh sách danh mục" 
        open={isModalVisible} 
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

      <Modal
        title="Danh sách sản phẩm đã hết"
        open={isOutOfStockModalVisible}
        onCancel={handleOutOfStockCancel}
        footer={[
          <Button key="back" onClick={handleOutOfStockCancel}>
            Đóng
          </Button>,
        ]}
      >
        <List
          bordered
          dataSource={getOutOfStockProducts()}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item.product_name}</Typography.Text>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default OverallInventory;
