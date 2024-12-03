import { Modal, Form, Input, Select, DatePicker, Typography, Table, Divider, Space, Tag, Button, Col, Row } from 'antd';
import { FileSearchOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

export default function IventoryModal(
  { editingReport, isModalVisible, handleModalOk, handleModalCancel, filteredProducts, handleAddProduct, loading, form, searchText, setSearchText }
) {
    return (
        <Modal
        title={
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
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
          okText={editingReport ? "Cập nhật" : "Tạo mới"}
          cancelText="Hủy"
          style={{ top: 20 }}
        >
          <Form
            form={form}
            layout="vertical"
            style={{ 
              maxHeight: 'calc(100vh - 200px)', 
              overflowY: 'auto', 
              padding: '24px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="check_date"
                  label="Ngày kiểm kê"
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    format="DD/MM/YYYY"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left" style={{margin: '32px 0'}}>
              <Space>
                <FileSearchOutlined />
                <span>Thông tin mặt hàng, nguyên liệu</span>
              </Space>
            </Divider>
            
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <Input
                placeholder="Tìm mặt hàng / nguyên liệu"
                prefix={<SearchOutlined style={{color: '#1890ff'}} />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                size="large"
                style={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              />
              {filteredProducts.length > 0 && searchText && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #e8e8e8',
                  borderRadius: '0 0 8px 8px',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleAddProduct(product)}
                      onMouseEnter={e => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                    >
                      <div>
                        <Text strong style={{display: 'block', color: '#262626'}}>
                          {product.product_name} ( {product.barcode} )
                        </Text>
                        <Text type="secondary" style={{fontSize: '12px'}}>
                          Mã SP: #{product.id}
                        </Text>
                      </div>
                      <Tag color="blue">
                        SL: {product.quantity || 0}
                      </Tag>
                    </div>
                  ))}
                </div>
              )}
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
                      width: '25%',
                      render: (_, record) => (
                        <Text strong style={{color: '#1890ff'}}>
                          {form.getFieldValue(['products', record.name, 'product_name'])}
                        </Text>
                      )
                    },
                    {
                      title: 'Số lượng trên hệ thống',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      width: '20%',
                      render: (_, record) => (
                        <Tag color="blue" style={{padding: '4px 12px', borderRadius: '4px'}}>
                          {form.getFieldValue(['products', record.name, 'quantity'])}
                        </Tag>
                      )
                    },
                    {
                      title: 'Số lượng thực tế',
                      dataIndex: 'actual_quantity',
                      key: 'actual_quantity',
                      width: '20%',
                      render: (_, record, index) => (
                        <Form.Item
                          name={[index, 'actual_quantity']}
                          style={{ marginBottom: 0 }}
                        >
                          <Input 
                            type="number" 
                            placeholder="Nhập số lượng"
                            style={{borderRadius: '6px'}}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: 'Lý do chênh lệch',
                      dataIndex: 'note',
                      key: 'note',
                      width: '25%',
                      render: (_, record, index) => (
                        <Form.Item
                          name={[index, 'note']}
                          style={{ marginBottom: 0 }}
                        >
                          <Input 
                            placeholder="Nhập ghi chú"
                            style={{borderRadius: '6px'}}
                          />
                        </Form.Item>
                      ),
                    },
                    {
                      title: 'Thao tác',
                      key: 'actions',
                      width: '10%',
                      render: (_, record, index) => (
                        <Button 
                          type="text" 
                          danger 
                          onClick={() => remove(index)}
                          icon={<DeleteOutlined />}
                          style={{borderRadius: '6px'}}
                        >
                          Xóa
                        </Button>
                      ),
                    }
                  ]}
                  pagination={false}
                  scroll={{ y: 300 }}
                  bordered
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                />
              )}
            </Form.List>

            <Form.Item
              name="note"
              label="Ghi chú"
              style={{ marginTop: '24px' }}
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Nhập ghi chú"
                style={{borderRadius: '8px'}}
              />
            </Form.Item>
          </Form>
        </Modal>
    );
}