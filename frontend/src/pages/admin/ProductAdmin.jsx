import React, { useState } from 'react';
import { Layout, Button, Space, Typography, Card, Row, Col, Form, message } from 'antd';
import { PlusOutlined, DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import OverallInventory from '../../components/admin/product/OverallInventory.jsx';
import ProductsTable from '../../components/admin/product/ProductsTable.jsx';
import useProducts from '../../utils/productUtils';
import useCatalogs from '../../utils/catalogUtils';
import useFactories from '../../utils/factoryUtils';
import ProductForm from '../../pages/admin/products/productForm';

const { Content } = Layout;
const { Title } = Typography;

const ProductAdmin = () => {
  const { products, createProduct } = useProducts();
  const { catalogs } = useCatalogs();
  const { factories } = useFactories();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const result = createProduct(values);
      if (result.success) {
        setIsModalVisible(false);
        form.resetFields();
        message.success(result.message);
      } else {
        message.error(result.message);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Title level={2} style={{ marginBottom: 0 }}>
                <BarChartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                Tổng quan tồn kho
              </Title>
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <OverallInventory />
            </Card>
          </Col>
          <Col span={24}>
            <Card>
              <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal} size="large">
                  Thêm sản phẩm
                </Button>
                <Button icon={<DownloadOutlined />} size="large">
                  Tải xuống tất cả
                </Button>
              </Space>
              <ProductsTable />
            </Card>
          </Col>
        </Row>
      </Content>
      
      <ProductForm 
        visible={isModalVisible}
        form={form} 
        catalogs={catalogs} 
        factories={factories} 
        onOk={handleOk} 
        onCancel={handleCancel}
        initialValues={null}
      />
    </Layout>
  );
};

export default ProductAdmin;