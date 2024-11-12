import React from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Select, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { GiftOutlined, CalendarOutlined, PercentageOutlined, ShoppingOutlined } from '@ant-design/icons';
import useProduct from '../../../utils/productUtils';
import usePromotion from '../../../utils/promorionUtils';

const { Title } = Typography;

function CreateDiscountPromotion({ products, onFinish }) {
    const [form] = Form.useForm();

    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const length = 8;
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        form.setFieldsValue({ code: result });
    };

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
            form={form}
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
                  initialValue="2"
                >
                  <Input type="hidden" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="code" 
                  label="Mã Voucher"
                  rules={[{ required: true, message: 'Vui lòng nhập mã Voucher' }]}
                >
                  <Input size="large" placeholder="Nhập mã Voucher" />
                </Form.Item>
                <Button type="dashed" onClick={generateRandomCode} icon={<GiftOutlined />}>
                  Tạo mã ngẫu nhiên
                </Button>
              </Col>
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
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item 
                  name="quantity" 
                  label="Số lượng Voucher"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                  <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="Nhập số lượng Voucher" />
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

export default CreateDiscountPromotion;
