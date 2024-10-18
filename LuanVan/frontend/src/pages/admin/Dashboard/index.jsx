import React from 'react';
import { Row, Col } from 'antd';
import SalesOverview from '../../../components/admin/SalesOverview';
import PurchaseOverview from '../../../components/admin/PurchaseOverview';
import InventorySummary from '../../../components/admin/InventorySummary';
import ProductSummary from '../../../components/admin/ProductSummary';
import SalesAndPurchaseChart from '../../../components/admin/SalesAndPurchaseChart';
import OrderSummaryChart from '../../../components/admin/OrderSummaryChart';
import TopSellingStock from '../../../components/admin/TopSellingStock';
import LowQuantityStock from '../../../components/admin/LowQuantityStock';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Row gutter={[16, 16]}>
            <Col span={12}><SalesOverview /></Col>
            <Col span={12}><PurchaseOverview /></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}><SalesAndPurchaseChart /></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}><TopSellingStock /></Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row gutter={[16, 16]}>
            <Col span={24}><InventorySummary /></Col>
            <Col span={24}><ProductSummary /></Col>
            <Col span={24}><OrderSummaryChart /></Col>
            <Col span={24}><LowQuantityStock /></Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
