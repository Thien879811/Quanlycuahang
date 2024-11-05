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
  DatePicker
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

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

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày kiểm kê',
      dataIndex: 'check_date',
      key: 'check_date',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phiếu kiểm kê này?"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              onClick={e => e.stopPropagation()}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (report) => {
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
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1>Báo cáo Kiểm kho</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Tạo phiếu kiểm kê
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={reports}
        loading={loading}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleView(record),
          style: { cursor: 'pointer' }
        })}
      />

      <Modal
        title={editingReport ? "Sửa phiếu kiểm kê" : "Thêm mới phiếu kiểm kê"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1200}
        centered
        destroyOnClose
        maskClosable={false}
        confirmLoading={loading}
        okText={editingReport ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="check_date"
              label="Ngày kiểm kê"
              rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm kê' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h3>Thông tin mặt hàng, nguyên liệu</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Input
                  placeholder="Tìm mặt hàng / nguyên liệu"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
                {filteredProducts.length > 0 && searchText && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {filteredProducts.map(product => (
                      <div
                        key={product.id}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                        onClick={() => handleAddProduct(product)}
                        onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                      >
                        {product.product_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Form.List name="products">
              {(fields, { add, remove }) => (
                <Table
                  dataSource={fields.map(field => {
                    const product = form.getFieldValue(['products', field.name]);
                    return {
                      ...field,
                      ...product
                    };
                  })}
                  columns={[
                    {
                      title: 'Tên mặt hàng',
                      dataIndex: 'product_name',
                      key: 'product_name',
                      render: (_, record) => form.getFieldValue(['products', record.name, 'product_name'])
                    },
                    {
                      title: 'Số lượng trên hệ thống',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      render: (_, record) => form.getFieldValue(['products', record.name, 'quantity'])
                    },
                    {
                      title: 'Số lượng thực tế',
                      dataIndex: 'actual_quantity',
                      key: 'actual_quantity',
                      render: (_, record, index) => (
                        <Form.Item
                          name={[index, 'actual_quantity']}
                          rules={[{ required: true, message: 'Bắt buộc nhập' }]}
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
                      render: (_, record, index) => (
                        <Form.Item
                          name={[index, 'note']}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="Nhập ghi chú" />
                        </Form.Item>
                      ),
                    },
                    {
                      title: 'Thao tác',
                      key: 'actions',
                      render: (_, record, index) => (
                        <Button 
                          type="link" 
                          danger 
                          onClick={() => remove(index)}
                          icon={<DeleteOutlined />}
                        >
                          Xóa
                        </Button>
                      ),
                    }
                  ]}
                  pagination={false}
                  scroll={{ y: 300 }}
                />
              )}
            </Form.List>
          </div>

          <Form.Item
            name="note"
            label="Ghi chú"
            style={{ marginTop: '24px' }}
          >
            <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết phiếu kiểm kê"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={1000}
      >
        {selectedReport && (
          <div>
            <p><strong>Ngày kiểm kê:</strong> {moment(selectedReport.check_date).format('DD/MM/YYYY')}</p>
            <p><strong>Ghi chú:</strong> {selectedReport.note || 'Không có ghi chú'}</p>
            <Table
              dataSource={selectedReport.check_inventory_details}
              columns={[
                {
                  title: 'Tên mặt hàng',
                  dataIndex: ['product', 'product_name'],
                  key: 'product_name',
                },
                {
                  title: 'Số lượng trên hệ thống',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Số lượng thực tế',
                  dataIndex: 'actual_quantity',
                  key: 'actual_quantity',
                },
                {
                  title: 'Chênh lệch',
                  key: 'difference',
                  render: (_, record) => record.actual_quantity - record.quantity,
                },
                {
                  title: 'Ghi chú',
                  dataIndex: 'note',
                  key: 'note',
                  render: (note) => note || 'Không có ghi chú'
                }
              ]}
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventoryReportAdmin;
