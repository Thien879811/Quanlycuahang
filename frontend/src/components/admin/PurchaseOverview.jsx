import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, DollarOutlined, CloseCircleOutlined, RollbackOutlined } from '@ant-design/icons';

const PurchaseOverview = ({ purchaseData }) => {
  const formatter = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card title="Tổng quan nhập hàng">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic
            title="Đơn nhập"
            value={purchaseData.purchaseOrders}
            prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Chi phí"
            value={purchaseData.purchaseCost}
            valueStyle={{ color: '#cf1322' }}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Đã hủy"
            value={purchaseData.canceledOrders}
            formatter={formatter}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Hoàn trả"
            value={purchaseData.refundedOrders}
            formatter={formatter}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PurchaseOverview;
