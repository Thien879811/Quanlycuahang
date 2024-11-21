import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, Card, Row, Col, Form, message, Spin } from 'antd';
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
  const { products, createProduct , fetchProducts} = useProducts();
  const { catalogs } = useCatalogs();
  const { factories } = useFactories();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([products, catalogs, factories]);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Layout>
      <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
        <Spin spinning={loading}>
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
                <OverallInventory products={products} />
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
                <ProductsTable products={products} fetchProducts={fetchProducts}/>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Content>
      
      <ProductForm 
        visible={isModalVisible}
        form={form} 
        catalogs={catalogs} 
        factories={factories} 
        setIsModalVisible={setIsModalVisible}
        onCancel={handleCancel}
        initialValues={null}
        loadData={loadData}
        fetchProducts={fetchProducts}
      />
    </Layout>
  );
};

export default ProductAdmin;