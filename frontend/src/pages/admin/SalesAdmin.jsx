import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Tabs, Typography, Layout, Space, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreatePromotion from '../../components/admin/Discount/CreatePromotion.jsx';
import PromotionList from '../../components/admin/Discount/PromotionList.jsx';
import CreateDiscountPromotion from '../../components/admin/Discount/CreateDiscountPromotion.jsx';
import CreateCrossProductPromotion from '../../components/admin/Discount/CreateCrossProductPromotion.jsx';
import CreateBulkPurchasePromotion from '../../components/admin/Discount/CreateBulkPurchasePromotion.jsx';
import useProduct from '../../utils/productUtils';
import usePromotion from '../../utils/promorionUtils';
import promotionService from '../../services/promotion.service.jsx';
import { handleResponse } from '../../functions';
const { TabPane } = Tabs;
const { Title } = Typography;
const { Content } = Layout;

function SalesAdmin() {
  const { products } = useProduct();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPromotion = useCallback(async () => {
    try {
        setLoading(true);
        const res = await promotionService.getPromotion();
        const data = handleResponse(res);
        setPromotions(data);
    } catch (error) {
        setError(error.message);
        console.error(error);
    } finally {
          setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotion();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async (values) => {
    console.log(values);
    try {
      const data = {
        catalory: values.catalory,
        name: values.name,
        code: values.code || null,
        discount_percentage: values.discount_percentage || null,
        product_id: Array.isArray(values.product_id) ? values.product_id : [values.product_id],
        present: values.present || null,
        description: values.description || null,
        quantity: values.quantity || null,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
      };
      console.log(data);
      const res = await promotionService.create(data);

      const dataResponse = handleResponse(res);

      if (!dataResponse.success) {
        message.error(dataResponse.error);
      } else {
        message.success('Tạo khuyến mãi giảm giá thành công');
        form.resetFields();
        setIsModalVisible(false);
        fetchPromotion();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2}>Quản lý khuyến mãi</Title>
            <Button onClick={showModal} type="primary" icon={<PlusOutlined />}>
              Tạo khuyến mãi mới
            </Button>
          </div>
          <PromotionList promotions={promotions} />
        </Space>
        <Modal
          title="Tạo khuyến mãi mới"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          destroyOnClose
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Giảm giá sản phẩm" key="1">
              <CreatePromotion products={products} onFinish={handleOk} form={form} />
            </TabPane>
            <TabPane tab="Tạo Voucher" key="2">
              <CreateDiscountPromotion onFinish={handleOk} form={form} />
            </TabPane>
            <TabPane tab="Giảm giá sản phẩm mua kèm" key="3">
              <CreateCrossProductPromotion products={products} onFinish={handleOk} form={form} />
            </TabPane>
            <TabPane tab="Khuyến mãi mua nhiều" key="4">
              <CreateBulkPurchasePromotion products={products} onFinish={handleOk} form={form} />
            </TabPane>
          </Tabs>
        </Modal>
      </Content>
    </Layout>
  );
}

export default SalesAdmin;
