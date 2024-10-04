import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, message, Row, Col, Card } from 'antd';
import usePromotion from '../../../utils/promorionUtils';
import useProduct from '../../../utils/productUtils';

const { Option } = Select;

function CreateCrossProductPromotion() {
    const [form] = Form.useForm();
    const { products } = useProduct();
    const [loading, setLoading] = useState(false);
    const { createPromotion } = usePromotion();

    const onFinish = async (values) => {
      setLoading(true);
      try {
        const data = {
          catalory: 'Giảm giá sản phẩm mua kèm',
          name: values.name,
          code: values.code || null,
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
        }
      } catch (err) {
        message.error('Có lỗi xảy ra khi tạo khuyến mãi');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card title="Tạo khuyến mãi mua sản phẩm này giảm giá sản phẩm khác" bordered={false}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Mã khuyến mãi">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="purchaseProductId" label="Sản phẩm mua" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm mua' }]}>
                <Select placeholder="Chọn sản phẩm mua">
                  {products.map(product => (
                    <Option key={product.id} value={product.id}>
                      {product.product_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discountedProductId" label="Sản phẩm được giảm giá" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm được giảm giá' }]}>
                <Select placeholder="Chọn sản phẩm được giảm giá">
                  {products.map(product => (
                    <Option key={product.id} value={product.id}>
                      {product.product_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="discountPercentage" label="Phần trăm giảm giá" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Tạo khuyến mãi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
export default CreateCrossProductPromotion;