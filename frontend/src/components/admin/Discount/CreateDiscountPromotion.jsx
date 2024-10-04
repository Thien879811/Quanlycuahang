import React from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Row, Col, Card } from 'antd';
import usePromotion from '../../../utils/promorionUtils';

function CreateDiscountPromotion() {
    const [form] = Form.useForm();
    const { createPromotion } = usePromotion();

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
      <Card title="Tạo khuyến mãi giảm giá" bordered={false}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Mã khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}>
                <Input />
              </Form.Item>
              <Form.Item>
                <Button onClick={generateRandomCode}>
                  Tạo mã ngẫu nhiên
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discount_percentage" label="Phần trăm giảm giá" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="start_date" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="end_date" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo khuyến mãi giảm giá
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

export default CreateDiscountPromotion;
