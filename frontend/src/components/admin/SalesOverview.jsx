import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BarChartOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const SalesOverview = ({salesOverview}) => {
  return (
    <Card title="Tổng quan doanh số">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic
            title="Số đơn hàng"
            value={salesOverview.sales}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Doanh thu"
            value={salesOverview.revenue}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Chi phí"
            value={salesOverview.cost}
            prefix={<FallOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Lợi nhuận"
            value={salesOverview.profit}
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SalesOverview;
