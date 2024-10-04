import React from 'react';
import { Form, Input, DatePicker, InputNumber, Button, message, Select, Row, Col, Card } from 'antd';
import useProduct from '../../../utils/productUtils';
import usePromotion from '../../../utils/promorionUtils';

function CreatePromotion() {
    const [form] = Form.useForm();
    const { products } = useProduct();
    const { createPromotion } = usePromotion();

    const onFinish = async (values) => {
      const data = {
        catalory: 'Giảm giá sản phẩm',
        name: values.name,
        code: values.code || null,
        discount_percentage: values.discount_percentage || null,
        product_id: values.product_id || null,
        present: values.present || null,
        description: values.description || null,
        quantity: values.quantity || null,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : null,
      }

      try {
        const error = await createPromotion(data);
        if(error){
          message.error(error);
        }else{
          message.success('Tạo chương trình khuyến mãi thành công');
          form.resetFields();
        }
      } catch (err) {
        message.error('Có lỗi xảy ra khi tạo chương trình khuyến mãi');
      }
    };
  
    return (
      <Card title="Tạo chương trình khuyến mãi" bordered={false}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Tên chương trình" rules={[{ required: true, message: 'Vui lòng nhập tên chương trình' }]}>
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
              <Form.Item name="discount_percentage" label="Phần trăm giảm giá" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="product_id" label="Sản phẩm áp dụng" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}>
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
            </Col>
          </Row>

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

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo chương trình khuyến mãi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }

export default CreatePromotion;