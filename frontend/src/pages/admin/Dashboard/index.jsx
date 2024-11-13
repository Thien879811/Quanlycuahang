import React, { useState, useEffect } from 'react';
import { Row, Col, Select, DatePicker, Spin, Typography, Card } from 'antd';
import { DashboardOutlined, CalendarOutlined } from '@ant-design/icons';
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
const { Title } = Typography;

const Dashboard = () => {
  const [salesOverview, setSalesOverview] = useState({ sales: 0, revenue: 0, profit: 0, cost: 0 });
  const [timeRange, setTimeRange] = useState('today');
  const [selectedDate, setSelectedDate] = useState(null);
  const [inventorySummary, setInventorySummary] = useState({ quantityInHand: 0, quantityToBeReceived: 0 });
  const [productSummary, setProductSummary] = useState({ numberOfSuppliers: 0, numberOfCategories: 0 });
  const [orderSummary, setOrderSummary] = useState({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 });
  const [salesAndPurchaseChartData, setSalesAndPurchaseChartData] = useState([]);
  const [topSellingStock, setTopSellingStock] = useState([]);
  const [lowQuantityStock, setLowQuantityStock] = useState([{title: '', avatar: '', description: ''}]);
  const [purchaseData, setPurchaseData] = useState({ purchaseOrders: 0, purchaseCost: 0, canceledOrders: 0, refundedOrders: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboardData();
    }, 500);

    return () => clearTimeout(timer);
  }, [timeRange, selectedDate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const timeParam = timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange;
      
      await Promise.all([
        getSalesOverview(timeParam),
        getInventorySummary(timeParam),
        getProductSummary(),
        getOrderSummary(),
        getSalesAndPurchaseChartData(),
        getTopSellingStock(timeParam),
        getLowQuantityStock(timeParam),
        getPurchaseData(timeParam)
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSalesOverview = async (type) => {
    try {
      const data = await dashboardService.getSalesOverview(type);
      setSalesOverview(handleResponse(data));
    } catch (error) {
      console.error(error);
    }
  }

  const getInventorySummary = async (type) => {
    try {
      const data = await dashboardService.getInventorySummary(type);
      setInventorySummary(handleResponse(data));
    } catch (error) {
      console.error(error);
    } 
  }

  const getPurchaseData = async (type) => {
    try {
      const data = await dashboardService.getPurchaseData(type);
      setPurchaseData(handleResponse(data));
    } catch (error) {
      console.error(error);
    } 
  }

  const getProductSummary = async (type) => {
    try {
      const data = await dashboardService.getProductSummary(type);
      setProductSummary(handleResponse(data));
    } catch (error) {
      console.error(error);
    } 
  }

  const getOrderSummary = async () => {
    try {
      const data = await dashboardService.getOrderSummary();
      const monthlyData = handleResponse(data);
      setOrderSummary({
        jan: monthlyData[1] || 0,
        feb: monthlyData[2] || 0, 
        mar: monthlyData[3] || 0,
        apr: monthlyData[4] || 0,
        may: monthlyData[5] || 0,
        jun: monthlyData[6] || 0,
        jul: monthlyData[7] || 0,
        aug: monthlyData[8] || 0,
        sep: monthlyData[9] || 0,
        oct: monthlyData[10] || 0,
        nov: monthlyData[11] || 0,
        dec: monthlyData[12] || 0
      });
      
    } catch (error) {
      console.error(error);
    } 
  }

  const getSalesAndPurchaseChartData = async () => {
    try {
      const data = await dashboardService.getSalesAndPurchaseChartData();
      const salesAndPurchaseChartData = handleResponse(data);
      setSalesAndPurchaseChartData(
        [
          { name: 'Th1', purchase: salesAndPurchaseChartData.purchase[1] || 0, sales: salesAndPurchaseChartData.sales[1] || 0 },
          { name: 'Th2', purchase: salesAndPurchaseChartData.purchase[2] || 0, sales: salesAndPurchaseChartData.sales[2] || 0 },
          { name: 'Th3', purchase: salesAndPurchaseChartData.purchase[3] || 0, sales: salesAndPurchaseChartData.sales[3] || 0 },
          { name: 'Th4', purchase: salesAndPurchaseChartData.purchase[4] || 0, sales: salesAndPurchaseChartData.sales[4] || 0 },
          { name: 'Th5', purchase: salesAndPurchaseChartData.purchase[5] || 0, sales: salesAndPurchaseChartData.sales[5] || 0 },
          { name: 'Th6', purchase: salesAndPurchaseChartData.purchase[6] || 0, sales: salesAndPurchaseChartData.sales[6] || 0 },
          { name: 'Th7', purchase: salesAndPurchaseChartData.purchase[7] || 0, sales: salesAndPurchaseChartData.sales[7] || 0 },  
          { name: 'Th8', purchase: salesAndPurchaseChartData.purchase[8] || 0, sales: salesAndPurchaseChartData.sales[8] || 0 },
          { name: 'Th9', purchase: salesAndPurchaseChartData.purchase[9] || 0, sales: salesAndPurchaseChartData.sales[9] || 0 },
          { name: 'Th10', purchase: salesAndPurchaseChartData.purchase[10] || 0, sales: salesAndPurchaseChartData.sales[10] || 0 },
          { name: 'Th11', purchase: salesAndPurchaseChartData.purchase[11] || 0, sales: salesAndPurchaseChartData.sales[11] || 0 },
          { name: 'Th12', purchase: salesAndPurchaseChartData.purchase[12] || 0, sales: salesAndPurchaseChartData.sales[12] || 0 },
        ]
      );
    } catch (error) {
      console.error(error);
    } 
  }

  const getTopSellingStock = async (type) => {
    try {
      const data = await dashboardService.getTopSellingStock(type);
      setTopSellingStock(handleResponse(data));
    } catch (error) {
      console.error(error);
    } 
  }

  const getLowQuantityStock = async (type) => {
    try {
      const data = await dashboardService.getLowQuantityStock(type);
      setLowQuantityStock(handleResponse(data));
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
    <Spin spinning={loading}>
      <div className="dashboard" style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <Card style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                <DashboardOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                Tổng quan
              </Title>
            </Col>
            <Col>
              <Row gutter={16} align="middle">
                <Col>
                  <CalendarOutlined style={{ fontSize: '18px', color: '#1890ff', marginRight: '8px' }} />
                </Col>
                <Col>
                  <Select 
                    value={timeRange}
                    style={{ width: 140 }} 
                    onChange={handleTimeRangeChange}
                    bordered={false}
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
                      bordered={false}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col span={18}>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card hoverable>
                  <SalesOverview salesOverview={salesOverview} />
                </Card>
              </Col>
              <Col span={12}>
                <Card hoverable>
                  <PurchaseOverview purchaseData={purchaseData} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col span={24}>
                <Card hoverable>
                  <SalesAndPurchaseChart data={salesAndPurchaseChartData} />
                </Card>
              </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col span={24}>
                <Card hoverable>
                  <TopSellingStock topSellingStock={topSellingStock} />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card hoverable>
                  <InventorySummary inventorySummary={inventorySummary} />
                </Card>
              </Col>
              <Col span={24}>
                <Card hoverable>
                  <ProductSummary productSummary={productSummary} />
                </Card>
              </Col>
              <Col span={24}>
                <Card hoverable>
                  <OrderSummaryChart orderSummary={orderSummary} />
                </Card>
              </Col>
              <Col span={24}>
                <Card hoverable>
                  <LowQuantityStock lowQuantityStock={lowQuantityStock} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Dashboard;
