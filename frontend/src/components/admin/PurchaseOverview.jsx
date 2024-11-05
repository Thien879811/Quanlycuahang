import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, DollarOutlined, CloseCircleOutlined, RollbackOutlined } from '@ant-design/icons';

const PurchaseOverview = () => {
  return (
    <Card title="Tổng quan mua hàng">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic
            title="Đơn mua"
            value={82}
            prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Chi phí"
            value={13573}
            prefix="₹"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Đã hủy"
            value={5}
            prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Hoàn trả"
            value={17432}
            prefix="₹"
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PurchaseOverview;
