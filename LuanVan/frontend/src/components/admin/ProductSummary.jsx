import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, UnorderedListOutlined } from '@ant-design/icons';

const ProductSummary = () => {
  return (
    <Card title="Product Summary">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Number of Suppliers"
            value={31}
            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Number of Categories"
            value={21}
            prefix={<UnorderedListOutlined style={{ color: '#13c2c2' }} />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ProductSummary;
