import React, { useState } from 'react';
import { Button, Modal, Tabs, Typography, Layout, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreatePromotion from '../../components/admin/Discount/CreatePromotion.jsx';
import PromotionList from '../../components/admin/Discount/PromotionList.jsx';
import CreateDiscountPromotion from '../../components/admin/Discount/CreateDiscountPromotion.jsx';
import CreateCrossProductPromotion from '../../components/admin/Discount/CreateCrossProductPromotion.jsx';
import CreateBulkPurchasePromotion from '../../components/admin/Discount/CreateBulkPurchasePromotion.jsx';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Content } = Layout;

function SalesAdmin() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
          <PromotionList />
        </Space>
        <Modal
          title="Tạo khuyến mãi mới"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Giảm giá sản phẩm" key="1">
              <CreatePromotion />
            </TabPane>
            <TabPane tab="Tạo Voucher" key="2">
              <CreateDiscountPromotion />
            </TabPane>
            <TabPane tab="Giảm giá sản phẩm mua kèm" key="3">
              <CreateCrossProductPromotion />
            </TabPane>
            <TabPane tab="Khuyến mãi mua nhiều" key="4">
              <CreateBulkPurchasePromotion />
            </TabPane>
          </Tabs>
        </Modal>
      </Content>
    </Layout>
  );
}

export default SalesAdmin;
