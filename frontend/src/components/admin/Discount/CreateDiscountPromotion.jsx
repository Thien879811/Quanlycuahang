import React from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { GiftOutlined, TagOutlined, PercentageOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import usePromotion from '../../../utils/promorionUtils';

const { Title } = Typography;

function CreateDiscountPromotion() {
    const [form] = Form.useForm();
    const { createPromotion,fetchPromotions } = usePromotion();

    const onFinish = async (values) => {
      try {
        const data = {
          catalory: 'Voucher',
          name: values.name,
          code: values.code || null,
          discount_percentage: values.discount_percentage || null,
          product_id: values.product_id || null,
          present: values.present || null,
          description: values.description || null,
          quantity: values.quantity || null,
          start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
          end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
        };
        const error = await createPromotion(data);
        if(error){
          message.error(error);
        }else{
          message.success('Tạo khuyến mãi giảm giá thành công');
          form.resetFields();
          fetchPromotions();
        }
      } catch (err) {
        message.error('Có lỗi xảy ra khi tạo khuyến mãi giảm giá');
      }
    };

    const generateRandomCode = () => {
      const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      form.setFieldsValue({ code: randomCode });
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
            Tạo Voucher giảm giá
          </Title>

          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item 
                  name="name" 
                  label={
                    <Space>
                      <TagOutlined />
                      <span>Tên Voucher</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập tên Voucher' }]}
                >
                  <Input size="large" placeholder="Nhập tên Voucher" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item 
                  name="code" 
                  label={
                    <Space>
                      <TagOutlined />
                      <span>Mã Voucher</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập mã Voucher' }]}
                >
                  <Input size="large" placeholder="Nhập mã Voucher" />
                </Form.Item>
                <Button type="dashed" onClick={generateRandomCode} icon={<TagOutlined />}>
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
                  label={
                    <Space>
                      <TagOutlined />
                      <span>Số lượng Voucher</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                  <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="Nhập số lượng Voucher" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              name="description" 
              label={
                <Space>
                  <FileTextOutlined />
                  <span>Mô tả</span>
                </Space>
              }
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về Voucher" />
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
                  <DatePicker size="large" style={{ width: '100%' }} />
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
                  <DatePicker size="large" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block icon={<GiftOutlined />}>
                Tạo Voucher
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    );
  }

export default CreateDiscountPromotion;
