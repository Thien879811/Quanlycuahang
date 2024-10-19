import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BarChartOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const SalesOverview = () => {
  const salesOverview = { sales: 832, revenue: 18300, profit: 868, cost: 17432 };

  return (
    <Card title="Sales Overview">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic
            title="Sales"
            value={salesOverview.sales}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Revenue"
            value={salesOverview.revenue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Profit"
            value={salesOverview.profit}
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Cost"
            value={salesOverview.cost}
            prefix={<FallOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SalesOverview;
