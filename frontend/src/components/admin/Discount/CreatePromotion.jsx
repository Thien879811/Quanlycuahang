import React from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Select, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { GiftOutlined, CalendarOutlined, PercentageOutlined, ShoppingOutlined } from '@ant-design/icons';
import useProduct from '../../../utils/productUtils';
import usePromotion from '../../../utils/promorionUtils';

const { Title } = Typography;

function CreatePromotion({ products, onFinish }) {
    return (
      <Card 
        className="promotion-card"
        style={{ 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ margin: 0 }}>
            <GiftOutlined style={{ marginRight: 8 }} />
            Tạo chương trình khuyến mãi
          </Title>
          
          <Form  
            onFinish={onFinish} 
            layout="vertical"
            style={{ marginTop: 24 }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item 
                  name="name" 
                  label="Tên chương trình" 
                  rules={[{ required: true, message: 'Vui lòng nhập tên chương trình' }]}
                >
                  <Input size="large" placeholder="Nhập tên chương trình khuyến mãi" />
                </Form.Item>

                <Form.Item
                  name="catalory"
                  hidden
                  initialValue="1"
                >
                  <Input type="hidden" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="discount_percentage" 
                  label={
                    <Space>
                      <PercentageOutlined />
                      <span>Phần trăm giảm giá</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Nhập phần trăm giảm giá"
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="product_id" 
                  label={
                    <Space>
                      <ShoppingOutlined />
                      <span>Sản phẩm áp dụng</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
                >
                  <Select
                    mode="multiple"
                    size="large"
                    placeholder="Chọn sản phẩm áp dụng"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {products.map(product => (
                      <Select.Option key={product.id} value={product.id}>
                        {product.product_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="start_date" 
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Ngày bắt đầu</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                  <DatePicker 
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="end_date" 
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Ngày kết thúc</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker 
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày kết thúc"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              name="description" 
              label="Mô tả"
            >
              <Input.TextArea 
                rows={4}
                placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi"
                style={{ fontSize: '14px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                block
                style={{
                  height: '48px',
                  fontSize: '16px',
                  marginTop: '16px'
                }}
              >
                Tạo chương trình khuyến mãi
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    );
  }

export default CreatePromotion;