import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message } from 'antd';
import axios from 'axios';

function CreateDiscountPromotion() {
    const [form] = Form.useForm();
  
    const onFinish = async (values) => {
      try {
        await axios.post('/api/promotions/discount', values);
        message.success('Tạo khuyến mãi giảm giá thành công');
        form.resetFields();
      } catch (error) {
        message.error('Có lỗi xảy ra khi tạo khuyến mãi giảm giá');
      }
    };
  
    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Mã khuyến mãi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="discountPercentage" label="Phần trăm giảm giá" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo khuyến mãi giảm giá
          </Button>
        </Form.Item>
      </Form>
    );
  }
export default CreateDiscountPromotion;

