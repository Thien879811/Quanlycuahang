import React, { useState, useEffect } from 'react';
import CheckInventoryService from '../../../services/inventory.service';
import ProductService from '../../../services/product.service';
import { handleResponse } from '../../../functions';
import { 
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  DatePicker,
  Card,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
  Select,
  Layout
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined, FileSearchOutlined, CheckCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import InventoryTable from './Inventory/InventoryTable';
import IventoryModal from './Inventory/IventoryModal';

const { Title, Text } = Typography;
const { Option } = Select;
const { Content } = Layout;

const StyledCard = styled(Card)`
  margin: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;

  .ant-card-body {
    padding: 24px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 8px;

  .title-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .anticon {
      font-size: 24px;
      color: #1890ff;
    }
  }
`;

const ActionButton = styled(Button)`
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.create-button {
    background: #1890ff;
    border-color: #1890ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.35);
    
    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }
`;

const StyledSelect = styled(Select)`
  min-width: 200px;
  .ant-select-selector {
    border-radius: 8px !important;
    height: 48px !important;
    padding: 8px 16px !important;
    
    .ant-select-selection-item {
      line-height: 32px !important;
    }
  }
`;

const StyledDatePicker = styled(DatePicker)`
  border-radius: 8px;
  height: 48px;
  padding: 8px 16px;
  
  input {
    font-size: 14px;
  }
`;

const ViewModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .ant-modal-header {
    padding: 20px 24px;
    background: #f8f9fa;
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .detail-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    
    .ant-card-body {
      padding: 24px;
    }
  }
`;

const InventoryReportAdmin = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [timeRange, setTimeRange] = useState('today');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    getReports();
    getProducts();
  }, [timeRange, selectedDate]);

  useEffect(() => {
    if (searchText) {
      const filtered = products.filter(product => 
        product.product_name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchText, products]);

  const getReports = async () => {
    setLoading(true);
    try {
      let params = timeRange;
      if (timeRange === 'customMonth' && selectedDate) {
        params = `${timeRange}?date=${selectedDate.format('YYYY-MM-DD')}`;
      }
      const response = await CheckInventoryService.getAll(params);
      const data = handleResponse(response);
      setReports(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getAll();
      const data = handleResponse(response);
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setIsViewModalVisible(true);
  };

  const handleAccept = async (id) => {
    try { 
      const response = await CheckInventoryService.accept(id);
      const data = handleResponse(response);
      console.log(data);
      message.success('Phiếu kiểm kê đã được chấp nhận');
      getReports();
    } catch (error) {
      message.error('Không thể chấp nhận phiếu kiểm kê');
    }
  };

  const handleEdit = (report) => {
    if (report.is_accepted) {
      message.error('Không thể chỉnh sửa phiếu đã được chấp nhận');
      return;
    }
    
    setEditingReport(report);
    
    const formattedProducts = report.check_inventory_details?.map(detail => ({
      product_id: detail.product.id,
      product_name: detail.product.product_name,
      quantity: detail.quantity,
      actual_quantity: detail.actual_quantity || 0,
      note: detail.note || ''
    })) || [];

    form.setFieldsValue({
      ...report,
      check_date: moment(report.check_date),
      products: formattedProducts
    });
    
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    const report = reports.find(r => r.id === id);
    if (report.is_accepted) {
      message.error('Không thể xóa phiếu đã được chấp nhận');
      return;
    }

    try {
      await CheckInventoryService.delete(id);
      message.success('Xóa phiếu kiểm kê thành công');
      getReports();
    } catch (error) {
      message.error('Không thể xóa phiếu kiểm kê');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      // Kiểm tra ngày kiểm kê
      if (!values.check_date) {
        message.error('Vui lòng chọn ngày kiểm kê');
        return;
      }

      // Kiểm tra danh sách sản phẩm
      if (!values.products || values.products.length === 0) {
        message.error('Vui lòng thêm ít nhất một sản phẩm để kiểm kê');
        return;
      }

      if(!values.note){
        message.error('Vui lòng nhập ghi chú');
        return;
      }

      // Kiểm tra số lượng thực tế của từng sản phẩm
      const invalidProducts = values.products.filter(
        product => !product.actual_quantity || product.actual_quantity < 0
      );

      if (invalidProducts.length > 0) {
        message.error('Vui lòng nhập số lượng thực tế hợp lệ cho tất cả sản phẩm');
        return;
      }

      const payload = {
        check_date: values.check_date.format('YYYY-MM-DD'),
        note: values.note,
        user_id: 1,
        products: values.products?.map(product => ({
          product_id: product.product_id,
          quantity: product.quantity,
          actual_quantity: product.actual_quantity,
          note: product.note
        })) || []
      };

      setLoading(true);
      
      if (editingReport) {
        try {
          await CheckInventoryService.update(editingReport.id, payload);
          message.success('Cập nhật phiếu kiểm kê thành công');
        } catch (error) {
          message.error('Không thể cập nhật phiếu kiểm kê');
          return;
        }
      } else {
        try {
          await CheckInventoryService.create(payload);
          message.success('Tạo phiếu kiểm kê thành công');
        } catch (error) {
          message.error('Không thể tạo phiếu kiểm kê');
          return;
        }
      }

      setIsModalVisible(false);
      form.resetFields();
      getReports();
      
    } catch (error) {
      message.error('Vui lòng kiểm tra lại các trường bắt buộc');
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingReport(null);
  };

  const showCreateModal = () => {
    setEditingReport(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleAddProduct = (product) => {
    const currentProducts = form.getFieldValue('products') || [];
    if (!currentProducts.find(p => p.product_id === product.id)) {
      form.setFieldsValue({
        products: [
          ...currentProducts,
          {
            product_id: product.id,
            product_name: product.product_name,
            quantity: product.quantity,
            actual_quantity: 0,
            note: ''
          }
        ]
      });
    }
    setSearchText('');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content>
        <StyledCard>
          <PageHeader>
            <div className="title-section">
              <DashboardOutlined />
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Báo cáo Kiểm kho</Title>
            </div>
            <Space size="large">
              <StyledSelect
                value={timeRange}
                onChange={(value) => {
                  setTimeRange(value);
                  if (value !== 'customMonth') {
                    setSelectedDate(null);
                  }
                }}
                style={{marginBottom:'12px'}}
              >
                <Option value="today">Hôm nay</Option>
                <Option value="yesterday">Hôm qua</Option>
                <Option value="week">Tuần này</Option>
                <Option value="month">Tháng này</Option>
                <Option value="year">Năm nay</Option>
                <Option value="customMonth">Tùy chọn tháng</Option>
              </StyledSelect>
              
              {timeRange === 'customMonth' && (
                <StyledDatePicker
                  picker="month"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  format="MM/YYYY"
                />
              )}
              
              <ActionButton 
                type="primary"
                className="create-button"
                onClick={showCreateModal}
                icon={<PlusOutlined />}
              >
                Tạo phiếu kiểm kê
              </ActionButton>
            </Space>
          </PageHeader>
          
          <InventoryTable 
            reports={reports}
            loading={loading}
            handleView={handleView}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAccept={handleAccept}
          />

          <IventoryModal
            editingReport={editingReport}
            isModalVisible={isModalVisible}
            handleModalOk={handleModalOk}
            handleModalCancel={handleModalCancel}
            filteredProducts={filteredProducts}
            handleAddProduct={handleAddProduct}
            loading={loading}
            form={form}
            searchText={searchText}
            setSearchText={setSearchText}
          />

          <ViewModal
            title={
              <Space>
                <FileSearchOutlined style={{color: '#1890ff'}} />
                <span style={{color: '#1890ff', fontWeight: 'bold'}}>Chi tiết phiếu kiểm kê</span>
              </Space>
            }
            open={isViewModalVisible}
            onCancel={() => {
              setIsViewModalVisible(false);
              setSelectedReport(null);
            }}
            footer={[
              <ActionButton 
                key="back" 
                type="primary" 
                onClick={() => {
                  setIsViewModalVisible(false);
                  setSelectedReport(null);
                }}
              >
                Đóng
              </ActionButton>
            ]}
            width={1000}
            style={{top: 80}}
          >
            {selectedReport && (
              <div style={{ padding: '24px' }}>
                <Card className="detail-card">
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Text type="secondary" style={{fontSize: '16px'}}>Ngày kiểm kê:</Text>
                        <Text strong style={{ marginLeft: 8, color: '#1890ff', fontSize: '16px' }}>
                          {moment(selectedReport.check_date).format('DD/MM/YYYY')}
                        </Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary" style={{fontSize: '16px'}}>Ghi chú:</Text>
                        <Text style={{ marginLeft: 8, fontSize: '16px' }}>
                          {selectedReport.note || 'Không có ghi chú'}
                        </Text>
                      </Col>
                    </Row>
                    <Table
                      dataSource={selectedReport.check_inventory_details}
                      columns={[
                        {
                          title: 'Tên mặt hàng',
                          dataIndex: ['product', 'product_name'],
                          key: 'product_name',
                          render: name => <Text strong style={{color: '#1890ff'}}>{name}</Text>
                        },
                        {
                          title: 'Số lượng trên hệ thống',
                          dataIndex: 'quantity',
                          key: 'quantity',
                          render: qty => (
                            <Tag color="blue" style={{padding: '6px 14px', borderRadius: '6px', fontSize: '14px'}}>
                              {qty}
                            </Tag>
                          )
                        },
                        {
                          title: 'Số lượng thực tế',
                          dataIndex: 'actual_quantity',
                          key: 'actual_quantity',
                          render: qty => (
                            <Tag color="green" style={{padding: '6px 14px', borderRadius: '6px', fontSize: '14px'}}>
                              {qty}
                            </Tag>
                          )
                        },
                        {
                          title: 'Chênh lệch',
                          key: 'difference',
                          render: (_, record) => {
                            const diff = record.actual_quantity - record.quantity;
                            return (
                              <Tag 
                                color={diff < 0 ? 'red' : diff > 0 ? 'green' : 'default'}
                                style={{padding: '6px 14px', borderRadius: '6px', fontSize: '14px'}}
                              >
                                {diff}
                              </Tag>
                            );
                          }
                        },
                        {
                          title: 'Ghi chú',
                          dataIndex: 'note',
                          key: 'note',
                          render: note => <Text>{note || 'Không có ghi chú'}</Text>
                        }
                      ]}
                      pagination={false}
                      bordered
                      style={{
                        marginTop: '16px',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                    />
                  </Space>
                </Card>
              </div>
            )}
          </ViewModal>
        </StyledCard>
      </Content>
    </Layout>
  );
};

export default InventoryReportAdmin;
