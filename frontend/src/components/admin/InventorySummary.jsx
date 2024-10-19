import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const InventorySummary = () => {
  return (
    <Card title="Inventory Summary">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Quantity in Hand"
            value={868}
            prefix={<InboxOutlined style={{ color: '#faad14' }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="To be received"
            value={200}
            prefix={<QuestionCircleOutlined style={{ color: '#722ed1' }} />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default InventorySummary;
