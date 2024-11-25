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
  Col
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined, FileSearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import InventoryTable from './Inventory/InventoryTable';
import IventoryModal from './Inventory/IventoryModal';

const { Title, Text } = Typography;

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

  useEffect(() => {
    getReports();
    getProducts();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = products.filter(product => 
        product.product_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchText, products]);

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await CheckInventoryService.getAll();
      const data = handleResponse(response);
      setReports(data);
    } catch (error) {
      message.error('Không thể tải báo cáo kiểm kho');
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
      message.error('Không thể tải danh sách sản phẩm');
    }
    setLoading(false);
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setIsViewModalVisible(true);
  };

  const handleAccept = async (id) => {
    try { 
      console.log(id);
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
    <Card 
      className="inventory-report-card" 
      style={{ 
        margin: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '0 8px'
      }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Báo cáo Kiểm kho</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          size="large"
          style={{ 
            borderRadius: '8px',
            height: '48px',
            padding: '0 24px',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(24,144,255,0.35)'
          }}
        >
          Tạo phiếu kiểm kê
        </Button>
      </div>
      
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
      <Modal
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
          <Button 
            key="back" 
            type="primary" 
            onClick={() => {
              setIsViewModalVisible(false);
              setSelectedReport(null);
            }}
            style={{borderRadius: '6px'}}
          >
            Đóng
          </Button>
        ]}
        width={1000}
        style={{top: 80}}
      >
        {selectedReport && (
          <div style={{ padding: '24px' }}>
            <Card style={{borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={24}>
                  <Col span={12}>
                    <Text type="secondary">Ngày kiểm kê:</Text>
                    <Text strong style={{ marginLeft: 8, color: '#1890ff' }}>
                      {moment(selectedReport.check_date).format('DD/MM/YYYY')}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Ghi chú:</Text>
                    <Text style={{ marginLeft: 8 }}>
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
                        <Tag color="blue" style={{padding: '4px 12px', borderRadius: '4px'}}>
                          {qty}
                        </Tag>
                      )
                    },
                    {
                      title: 'Số lượng thực tế',
                      dataIndex: 'actual_quantity',
                      key: 'actual_quantity',
                      render: qty => (
                        <Tag color="green" style={{padding: '4px 12px', borderRadius: '4px'}}>
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
                            style={{padding: '4px 12px', borderRadius: '4px'}}
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
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                />
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default InventoryReportAdmin;
