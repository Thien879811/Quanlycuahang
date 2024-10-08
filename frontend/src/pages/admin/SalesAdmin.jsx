import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Select, Table, Modal, Tabs } from 'antd';
import axios from 'axios';
import CreatePromotion from '../../components/admin/Discount/CreatePromotion.jsx';
import PromotionList from '../../components/admin/Discount/PromotionList.jsx';
import CreateDiscountPromotion from '../../components/admin/Discount/CreateDiscountPromotion.jsx';
import CreateCrossProductPromotion from '../../components/admin/Discount/CreateCrossProductPromotion.jsx';
import CreateBulkPurchasePromotion from '../../components/admin/Discount/CreateBulkPurchasePromotion.jsx';

const { TabPane } = Tabs;

function SalesAdmin() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>Quản lý khuyến mãi</h1>
      <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>
        Tạo khuyến mãi mới
      </Button>
      <PromotionList />
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
    </div>
  );
}

export default SalesAdmin;
