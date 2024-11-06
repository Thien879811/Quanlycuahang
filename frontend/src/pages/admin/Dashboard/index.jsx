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
  const [inventorySummary, setInventorySummary] = useState({ quantityInHand: 0, quantityToBeReceived: 0 });
  const [productSummary, setProductSummary] = useState({ numberOfSuppliers: 0, numberOfCategories: 0 });
  const [orderSummary, setOrderSummary] = useState({ jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 });
  const [salesAndPurchaseChartData, setSalesAndPurchaseChartData] = useState([]);
  const [topSellingStock, setTopSellingStock] = useState([]);
  const [lowQuantityStock, setLowQuantityStock] = useState([{title: '', avatar: '', description: ''}]);
  const [purchaseData, setPurchaseData] = useState({ purchaseOrders: 0, purchaseCost: 0, canceledOrders: 0, refundedOrders: 0 });

  useEffect(() => {
      getSalesOverview(timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange);
      getInventorySummary(timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange);
      getProductSummary();
      getOrderSummary();
      getSalesAndPurchaseChartData();
      getTopSellingStock(timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange);
      getLowQuantityStock(timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange);
      getPurchaseData(timeRange === 'custom' && selectedDate ? selectedDate.format('YYYY-MM-DD') : timeRange);

  }, [timeRange, selectedDate]);

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

  const getTopSellingStock = async () => {
    try {
      const data = await dashboardService.getTopSellingStock();
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
            <Col span={12}><PurchaseOverview purchaseData={purchaseData} /></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}><SalesAndPurchaseChart data={salesAndPurchaseChartData} /></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}><TopSellingStock topSellingStock={topSellingStock} /></Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row gutter={[16, 16]}>
            <Col span={24}><InventorySummary inventorySummary={inventorySummary} /></Col>
            <Col span={24}><ProductSummary productSummary={productSummary} /></Col>
            <Col span={24}><OrderSummaryChart orderSummary={orderSummary} /></Col>
            <Col span={24}><LowQuantityStock lowQuantityStock={lowQuantityStock} /></Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
