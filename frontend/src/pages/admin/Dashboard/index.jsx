import React, { useState, useEffect } from 'react';
import { Row, Col, Select, DatePicker } from 'antd';
import SalesOverview from '../../../components/admin/SalesOverview';
import PurchaseOverview from '../../../components/admin/PurchaseOverview';
import InventorySummary from '../../../components/admin/InventorySummary';
import ProductSummary from '../../../components/admin/ProductSummary';
import SalesAndPurchaseChart from '../../../components/admin/SalesAndPurchaseChart';
import OrderSummaryChart from '../../../components/admin/OrderSummaryChart';
import TopSellingStock from '../../../components/admin/TopSellingStock';
import LowQuantityStock from '../../../components/admin/LowQuantityStock';
import dashboardService from '../../../services/dashboard.service';
import {handleResponse} from '../../../functions';

const { Option } = Select;

const Dashboard = () => {
  const [salesOverview, setSalesOverview] = useState({ sales: 0, revenue: 0, profit: 0, cost: 0 });
  const [timeRange, setTimeRange] = useState('today');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    getSalesOverview(timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange);
  }, [timeRange, selectedDate]);

  const getSalesOverview = async (type) => {
    try {
      const data = await dashboardService.getSalesOverview(type);
      console.log(data);
      setSalesOverview(handleResponse(data));
    } catch (error) {
      console.error(error);
    }
  }

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    if (value !== 'custom') {
      setSelectedDate(null);
    }
  };

  return (
    <div className="dashboard">
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col>
          <Select 
            value={timeRange}
            style={{ width: 120 }} 
            onChange={handleTimeRangeChange}
          >
            <Option value="today">Hôm nay</Option>
            <Option value="yesterday">Hôm qua</Option>
            <Option value="week">Tuần này</Option>
            <Option value="month">Tháng này</Option>
            <Option value="year">Năm nay</Option>
            <Option value="custom">Tùy chọn</Option>
          </Select>
          {timeRange === 'custom' && (
            <DatePicker 
              style={{ marginLeft: 16 }}
              onChange={setSelectedDate}
              value={selectedDate}
            />
          )}
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <Row gutter={[16, 16]}>
            <Col span={12}><SalesOverview salesOverview={salesOverview} /></Col>
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
