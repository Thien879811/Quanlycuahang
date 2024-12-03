import React, { useState, useEffect } from 'react';
import CheckInventoryService from '../../services/inventory.service';
import ProductService from '../../services/product.service';
import { handleResponse } from '../../functions';
import { 
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  DatePicker,
  Card,
  Typography,
  Row,
  Col,
  Select,
  Tag,
  Tooltip,
  Divider
} from 'antd';
import { EditOutlined, PlusOutlined, SearchOutlined, EyeOutlined, DeleteOutlined, ArrowLeftOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const InventoryReport = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]); // Store all reports for filtering
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    getReports();
    getProducts();
  }, []);

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

  // New effect for filtering reports
  useEffect(() => {
    let filteredReports = [...allReports];

    // Filter by ID
    if (searchId) {
      filteredReports = filteredReports.filter(report => 
        report.id.toString().includes(searchId)
      );
    }

    setReports(filteredReports);
  }, [searchId, allReports]);

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await CheckInventoryService.getAll();
      const data = handleResponse(response);
      setReports(data);
      setAllReports(data); // Store all reports for filtering
    } catch (error) {
      message.error('Không thể tải báo cáo kiểm kê');
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearch = (value) => {
    setSearchId(value);
  };

  const handleReset = () => {
    setSearchId('');
    setReports(allReports);
  };

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Ngày kiểm kê',
      dataIndex: 'check_date',
      key: 'check_date',
      width: '15%',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: '55%',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleView(record);
              }}
            />
          </Tooltip>
          {record.status !== 1 && (
            <Tooltip title="Chỉnh sửa">
              <Button 
                type="default"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record);
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (report) => {
    if (report.status === 1) {
      message.error('Không thể chỉnh sửa phiếu đã được duyệt');
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
        if (editingReport.status === 1) {
          message.error('Không thể cập nhật phiếu đã được duyệt');
          return;
        }
        try {
          await CheckInventoryService.update(editingReport.id, payload);
          message.success('Cập nhật phiếu kiểm kê thành công');
        } catch (error) {
          console.log(error);
          message.error('Không thể cập nhật phiếu kiểm kê');
          return;
        }
      } else {
        try {
          await CheckInventoryService.create(payload);
          message.success('Tạo phiếu kiểm kê thành công');
        } catch (error) {
          console.log(error);
          message.error('Không thể tạo phiếu kiểm kê');
          return;
        }
      }

      setIsModalVisible(false);
      form.resetFields();
      getReports();
      setEditingReport(null);
      
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
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} className="shadow-sm">
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col flex="none">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              style={{ marginRight: 16, border: 'none' }}
              size="large"
            />
            <Title level={3} style={{ margin: 0, display: 'inline' }}>
              Báo cáo kiểm kho
            </Title>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={showCreateModal}
              size="large"
              style={{ borderRadius: '6px', height: '40px' }}
            >
              Tạo báo cáo mới
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={20}>
            <Input
              placeholder="Tìm kiếm theo mã phiếu"
              prefix={<SearchOutlined />}
              value={searchId}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Button onClick={handleReset} style={{ width: '100%' }}>
              Đặt lại
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={reports}
          loading={loading}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleView(record),
            style: { cursor: 'pointer' }
          })}
          bordered
          scroll={{ x: 800, y: 'calc(100vh - 300px)' }}
          className="custom-table"
        />
      </Card>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingReport ? "Sửa phiếu kiểm kê" : "Thêm mới phiếu kiểm kê"}
          </Title>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1200}
        centered
        destroyOnClose
        maskClosable={false}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 0' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="check_date"
                label="Ngày kiểm kê"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm kê' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thông tin mặt hàng, nguyên liệu</Divider>
          
          <div style={{ marginBottom: '20px' }}>
            <Input
              placeholder="Tìm mặt hàng / nguyên liệu"
              prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            {filteredProducts.length > 0 && searchText && (
              <Card 
                style={{
                  position: 'absolute',
                  width: '100%',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
                bodyStyle={{ padding: '0' }}
              >
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                    onClick={() => handleAddProduct(product)}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                  >
                    {product.product_name} ( {product.barcode} )
                  </div>
                ))}
              </Card>
            )}
          </div>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <Table
                dataSource={fields}
                columns={[
                  {
                    title: 'Tên mặt hàng',
                    dataIndex: 'product_name',
                    key: 'product_name',
                    width: '25%',
                    render: (_, record) => (
                      <span style={{ fontWeight: 500 }}>
                        {form.getFieldValue(['products', record.name, 'product_name'])}
                      </span>
                    )
                  },
                  {
                    title: 'Số lượng hệ thống',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    width: '15%',
                    render: (_, record) => (
                      <Tag color="blue">
                        {form.getFieldValue(['products', record.name, 'quantity'])}
                      </Tag>
                    )
                  },
                  {
                    title: 'Số lượng thực tế',
                    dataIndex: 'actual_quantity',
                    key: 'actual_quantity',
                    width: '20%',
                    render: (_, record) => (
                      <Form.Item
                        name={[record.name, 'actual_quantity']}
                        rules={[{ required: true, message: 'Bắt buộc' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input type="number" placeholder="Nhập số lượng" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: 'Lý do chênh lệch',
                    dataIndex: 'note',
                    key: 'note',
                    width: '30%',
                    render: (_, record) => (
                      <Form.Item
                        name={[record.name, 'note']}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Nhập ghi chú" />
                      </Form.Item>
                    ),
                  },
                  {
                    title: '',
                    key: 'actions',
                    width: '10%',
                    render: (_, record) => (
                      <Button 
                        type="text" 
                        danger 
                        onClick={() => remove(record.name)}
                        icon={<DeleteOutlined />}
                      />
                    ),
                  }
                ]}
                pagination={false}
                scroll={{ y: 300 }}
                bordered
              />
            )}
          </Form.List>

          <Form.Item
            name="note"
            label="Ghi chú"
            style={{ marginTop: '24px' }}
          >
            <Input.TextArea rows={4} placeholder="Nhập ghi chú chung cho phiếu kiểm kê" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            Chi tiết phiếu kiểm kê
          </Title>
        }
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={1000}
      >
        {selectedReport && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#f5f5f5' }}>
                  <p style={{ margin: 0 }}><strong>Ngày kiểm kê:</strong></p>
                  <p style={{ fontSize: '16px', margin: '8px 0 0' }}>
                    {moment(selectedReport.check_date).format('DD/MM/YYYY')}
                  </p>
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false} style={{ background: '#f5f5f5' }}>
                  <p style={{ margin: 0 }}><strong>Ghi chú:</strong></p>
                  <p style={{ fontSize: '16px', margin: '8px 0 0' }}>
                    {selectedReport.note || 'Không có ghi chú'}
                  </p>
                </Card>
              </Col>
            </Row>
            
            <Table
              dataSource={selectedReport.check_inventory_details}
              columns={[
                {
                  title: 'Tên mặt hàng',
                  key: 'product_name',
                  render: (_, record) => record.product?.product_name,
                  width: '30%'
                },
                {
                  title: 'Số lượng hệ thống',
                  dataIndex: 'quantity',
                  key: 'quantity',
                  width: '15%',
                  render: (quantity) => (
                    <Tag color="blue">{quantity}</Tag>
                  )
                },
                {
                  title: 'Số lượng thực tế',
                  dataIndex: 'actual_quantity',
                  key: 'actual_quantity',
                  width: '15%',
                  render: (quantity) => (
                    <Tag color="green">{quantity}</Tag>
                  )
                },
                {
                  title: 'Chênh lệch',
                  key: 'difference',
                  width: '15%',
                  render: (_, record) => {
                    const diff = record.actual_quantity - record.quantity;
                    return (
                      <Tag color={diff < 0 ? 'red' : diff > 0 ? 'green' : 'default'}>
                        {diff > 0 ? `+${diff}` : diff}
                      </Tag>
                    );
                  }
                },
                {
                  title: 'Ghi chú',
                  dataIndex: 'note',
                  key: 'note',
                  width: '25%'
                }
              ]}
              pagination={false}
              bordered
              scroll={{ y: 400 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryReport;
