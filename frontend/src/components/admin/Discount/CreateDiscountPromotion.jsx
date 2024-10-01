import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import usePromotion from '../../../utils/promorionUtils';

function CreateDiscountPromotion() {
    const [form] = Form.useForm();
    const { createPromotion } = usePromotion();

    const onFinish = async (values) => {
      try {
        const data = {
          name: values.name,
          code: values.code || 0,
          discount_percentage: values.discount_percentage || 0,
          product_id: values.product_id || 0,
          present: values.present || 0,
          description: values.description || '',
          quantity: values.quantity || 0,
          start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
          end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
        };
        await createPromotion(data);
        message.success('Tạo khuyến mãi giảm giá thành công');
        form.resetFields();
      } catch (error) {
        message.error('Có lỗi xảy ra khi tạo khuyến mãi giảm giá');
      }
    };

    const generateRandomCode = () => {
      const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      form.setFieldsValue({ code: randomCode });
    };
  
    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Mã khuyến mãi" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button onClick={generateRandomCode}>
            Tạo mã ngẫu nhiên
          </Button>
        </Form.Item>
        <Form.Item name="discount_percentage" label="Phần trăm giảm giá" rules={[{ required: true }]}>
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="start_date" label="Ngày bắt đầu" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="end_date" label="Ngày kết thúc" rules={[{ required: true }]}>
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
