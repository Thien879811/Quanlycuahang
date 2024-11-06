import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BarChartOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const SalesOverview = ({salesOverview}) => {
  const formatter = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value);
  };
  return (
    <Card title="Tổng quan doanh số">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Statistic
            title="Số đơn hàng"
            value={salesOverview.sales}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Doanh thu"
            value={salesOverview.revenue}
            valueStyle={{ color: '#cf1322' }}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Chi phí"
            value={salesOverview.cost}
            //prefix={<FallOutlined />}
            valueStyle={{ color: '#cf1322' }}
            formatter={formatter}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Lợi nhuận"
            value={salesOverview.profit}
          
            valueStyle={{ color: '#3f8600' }}
            formatter={formatter}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SalesOverview;
