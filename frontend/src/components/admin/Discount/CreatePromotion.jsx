import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Select } from 'antd';
import axios from 'axios';
import productService from '../../../services/product.service';
import promotionService from '../../../services/promotion.service';

function CreatePromotion() {
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      fetchProducts();
    }, []);
  
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        const cleanJsonString = response.replace(/^<!--\s*|\s*-->$/g, '');
        const data = JSON.parse(cleanJsonString);
        console.log(data);
        setProducts(data);
      } catch (error) {
        message.error('Không thể tải danh sách sản phẩm');
      }
    };
  
    const onFinish = async (values) => {
        try {
            console.log(values);
            await promotionService.create(values);
            message.success('Tạo chương trình khuyến mãi thành công');
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo chương trình khuyến mãi');
        }
    };
  
    return (
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label="Tên chương trình" rules={[{ required: true, message: 'Vui lòng nhập tên chương trình' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Mã khuyến mãi">
          <Input />
        </Form.Item>
        <Form.Item name="discountPercentage" label="Phần trăm giảm giá" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}>
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="productIds" label="Sản phẩm áp dụng" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}>
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm"
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo chương trình khuyến mãi
          </Button>
        </Form.Item>
      </Form>
    );
  }
export default CreatePromotion;