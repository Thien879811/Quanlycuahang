import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Modal, List, Input, Form, Avatar, Popconfirm } from 'antd';
import { createGlobalStyle } from 'styled-components';
import { EyeOutlined, PlusOutlined, AppstoreOutlined, ShoppingOutlined, WarningOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useCatalogs from '../../../utils/catalogUtils';
import cataloryService from '../../../services/catalory.service';

const { Text, Title } = Typography;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
    background: #f0f2f5;
  }
`;

const StatisticCard = ({ title, value1, value2, subLabel1, subLabel2, titleColor, showViewButton, onViewClick, icon }) => (
  <Col span={8}>
    <Card 
      hoverable
      bodyStyle={{ padding: '24px' }}
      style={{ 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            icon={icon} 
            style={{ 
              backgroundColor: titleColor,
              padding: '8px',
              fontSize: '20px'
            }} 
          />
          <Text strong style={{ color: titleColor, fontSize: '18px', fontWeight: 600 }}>
            {title}
          </Text>
        </div>
        {showViewButton && (
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="large"
            onClick={onViewClick}
            style={{ color: titleColor }}
          >
            Xem
          </Button>
        )}
      </div>
      <Row gutter={24} align="bottom">
        <Col>
          <Text style={{ 
            fontSize: '32px', 
            fontWeight: 700, 
            display: 'block', 
            marginBottom: '8px',
            background: `linear-gradient(45deg, ${titleColor}, ${titleColor}dd)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {value1}
          </Text>
          <Text type="secondary" style={{ fontSize: '14px', fontWeight: 400 }}>
            {subLabel1}
          </Text>
        </Col>
        {value2 && (
          <Col>
            <Text style={{ fontSize: '32px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              {value2}
            </Text>
            <Text type="secondary" style={{ fontSize: '14px', fontWeight: 400 }}>
              {subLabel2}
            </Text>
          </Col>
        )}
      </Row>
    </Card>
  </Col>
);

const OverallInventory = ({products, catalogs, loadData}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOutOfStockModalVisible, setIsOutOfStockModalVisible] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState(null);
  const {createCatalog, updateCatalog, deleteCatalog} = useCatalogs();
  const [form] = Form.useForm();

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
    setEditingCatalog(null);
    form.resetFields();
  };

  const handleOutOfStockCancel = () => {
    setIsOutOfStockModalVisible(false);
  };

  const handleAddCategory = async (values) => {
    if (editingCatalog) {
      try {
        await cataloryService.update(editingCatalog.id, values);
      } catch (error) {
        console.error('Error updating catalog:', error);
      }
    } else {
      try {
        await cataloryService.create(values);
      } catch (error) {
        console.error('Error creating catalog:', error);
      }
    }
    loadData();
    form.resetFields();
    setEditingCatalog(null);
    handleCancel();
  };

  const handleEditCatalog = (catalog) => {
    setEditingCatalog(catalog);
    form.setFieldsValue({
      catalogy_name: catalog.catalogy_name
    });
  };

  const handleDeleteCatalog = async (catalogId) => {
    try {
      await cataloryService.delete(catalogId);
      loadData();
    } catch (error) {
      console.error('Error deleting catalog:', error);
    }
  };

  const getOutOfStockCount = () => {
    return products?.filter(product => product.quantity === 0).length || 0;
  };

  const getOutOfStockProducts = () => {
    return products?.filter(product => product.quantity === 0) || [];
  };

  return (
    <div style={{ padding: '24px' }}>
      <GlobalStyle />
      <Title level={2} style={{ marginBottom: '24px' }}>Tổng quan kho hàng</Title>
      <Row gutter={[24, 24]}>
        <StatisticCard
          title="Danh mục"
          value1={catalogs?.length || 0}
          titleColor="#1890ff"
          showViewButton={true}
          onViewClick={showModal}
          icon={<AppstoreOutlined />}
        />
        <StatisticCard
          title="Tổng sản phẩm"
          value1={products?.length || 0}
          subLabel2="Doanh thu"
          titleColor="#52c41a"
          icon={<ShoppingOutlined />}
        />
        <StatisticCard
          title="Sản phẩm đã hết"
          value1={getOutOfStockCount()}
          subLabel1="Sản phẩm"
          titleColor="#ff4d4f"
          showViewButton={true}
          onViewClick={showOutOfStockModal}
          icon={<WarningOutlined />}
        />
      </Row>

      <Modal 
        title={<Title level={4}>{editingCatalog ? 'Sửa danh mục' : 'Danh sách danh mục'}</Title>}
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleCancel} size="large">
            Đóng
          </Button>,
        ]}
      >
        <List
          bordered
          style={{ 
            borderRadius: '8px',
            marginBottom: '24px'
          }}
          dataSource={catalogs}
          renderItem={(item) => (
            <List.Item 
              style={{ padding: '16px' }}
              actions={[
                <Button 
                  icon={<EditOutlined />} 
                  type="text"
                  onClick={() => handleEditCatalog(item)}
                />,
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa danh mục này?"
                  onConfirm={() => handleDeleteCatalog(item.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    icon={<DeleteOutlined />} 
                    type="text"
                    danger
                  />
                </Popconfirm>
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar icon={<AppstoreOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <Typography.Text strong>{item.catalogy_name}</Typography.Text>
              </div>
            </List.Item>
          )}
        />
        <Form 
          form={form} 
          onFinish={handleAddCategory} 
          layout="vertical"
        >
          <Form.Item
            name="catalogy_name"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input 
              placeholder="Nhập tên danh mục" 
              size="large"
              prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={editingCatalog ? <EditOutlined /> : <PlusOutlined />}
              size="large"
              block
            >
              {editingCatalog ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<Title level={4}>Danh sách sản phẩm đã hết</Title>}
        open={isOutOfStockModalVisible}
        onCancel={handleOutOfStockCancel}
        width={600}
        footer={[
          <Button key="back" onClick={handleOutOfStockCancel} size="large">
            Đóng
          </Button>,
        ]}
      >
        <List
          bordered
          style={{ borderRadius: '8px' }}
          dataSource={getOutOfStockProducts()}
          renderItem={(item) => (
            <List.Item style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar icon={<WarningOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
                <Typography.Text strong>{item.product_name} ({item.barcode})</Typography.Text>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default OverallInventory;
