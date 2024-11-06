import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const InventorySummary = ({inventorySummary}) => {
  return (
    <Card title="Tổng quan tồn kho">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Số lượng trong kho"
            value={inventorySummary.quantityInHand}
            prefix={<InboxOutlined style={{ color: '#faad14' }} />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Sắp nhập kho"
            value={inventorySummary.quantityToBeReceived}
            prefix={<QuestionCircleOutlined style={{ color: '#722ed1' }} />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default InventorySummary;
