import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, message, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { GiftOutlined, ShoppingCartOutlined, PercentageOutlined, CalendarOutlined } from '@ant-design/icons';
import usePromotion from '../../../utils/promorionUtils';
import useProduct from '../../../utils/productUtils';

const { Option } = Select;
const { Title } = Typography;

function CreateCrossProductPromotion() {
    const [form] = Form.useForm();
    const { products } = useProduct();
    const [loading, setLoading] = useState(false);
    const { createPromotion,fetchPromotions } = usePromotion();

    const onFinish = async (values) => {
      setLoading(true);
      try {
        const data = {
          catalory: '3',
          name: values.name,
          code: null,
          discount_percentage: values.discountPercentage || null,
          product_id: [values.purchaseProductId] || null,
          present: values.discountedProductId || null,
          description: values.description || null,
          quantity: values.quantity || null,
          start_date: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
          end_date: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        };
        const error  = await createPromotion(data);
        if(error){
          message.error(error);
        }else{
          message.success('Tạo khuyến mãi mua sản phẩm này giảm giá sản phẩm khác thành công');
          form.resetFields();
          fetchPromotions();
        }
      } catch (err) {
        message.error('Có lỗi xảy ra khi tạo khuyến mãi');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card 
        className="promotion-card"
        style={{ 
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          padding: '24px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            <GiftOutlined style={{ marginRight: 8 }} />
            Tạo khuyến mãi mua kèm sản phẩm
          </Title>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item 
                  name="name" 
                  label={
                    <Space>
                      <ShoppingCartOutlined />
                      <span>Tên chương trình khuyến mãi</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}
                >
                  <Input size="large" placeholder="Nhập tên chương trình khuyến mãi" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="purchaseProductId" 
                  label={
                    <Space>
                      <ShoppingCartOutlined />
                      <span>Sản phẩm chính</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn sản phẩm mua' }]}
                >
                  <Select size="large" placeholder="Chọn sản phẩm chính">
                    {products.map(product => (
                      <Option key={product.id} value={product.id}>
                        {product.product_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="discountedProductId" 
                  label={
                    <Space>
                      <GiftOutlined />
                      <span>Sản phẩm mua kèm được giảm giá</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn sản phẩm được giảm giá' }]}
                >
                  <Select size="large" placeholder="Chọn sản phẩm được giảm giá">
                    {products.map(product => (
                      <Option key={product.id} value={product.id}>
                        {product.product_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="discountPercentage" 
                  label={
                    <Space>
                      <PercentageOutlined />
                      <span>Phần trăm giảm giá</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}
                >
                  <InputNumber
                    size="large"
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="description" 
                  label="Mô tả chi tiết"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                  <Input.TextArea 
                    size="large"
                    rows={4}
                    placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="startDate" 
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Ngày bắt đầu</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                >
                  <DatePicker size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="endDate" 
                  label={
                    <Space>
                      <CalendarOutlined />
                      <span>Ngày kết thúc</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                >
                  <DatePicker size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: '24px' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block 
                size="large"
                style={{ height: '48px', fontSize: '16px' }}
              >
                Tạo chương trình khuyến mãi
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    );
  }

export default CreateCrossProductPromotion;