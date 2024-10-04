import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, message, Row, Col, Card } from 'antd';
import usePromotion from '../../../utils/promorionUtils';
import useProduct from '../../../utils/productUtils';

const { Option } = Select;

function CreateBulkPurchasePromotion() {
    const [form] = Form.useForm();
    const { products } = useProduct();    
    const { createPromotion } = usePromotion();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const data = {
                catalory: 'Khuyến mãi mua nhiều',
                name: values.name,
                code: values.code || null,
                discount_percentage: values.discountPercentage || null,
                product_id: [values.productId] || null,
                present: values.present || null,
                description: values.description || null,
                quantity: values.quantity || null,
                start_date: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
                end_date: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
            };

            const error = await createPromotion(data);
            if(error){
                message.error(error);
            }else{
                message.success('Khuyến mãi đã được tạo thành công');
                form.resetFields();
            }
        } catch (err) {
            message.error('Không thể tạo khuyến mãi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Tạo khuyến mãi mua nhiều" bordered={false}>
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
                        <Form.Item name="discountPercentage" label="Phần trăm giảm giá" rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá' }]}>
                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="productId" label="Sản phẩm" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}>
                            <Select>
                                {products.map((product) => (
                                    <Option key={product.id} value={product.id}>
                                        {product.product_name}
                                    </Option>   
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="present" label="Phần thưởng">
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="startDate" label="Ngày bắt đầu">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="endDate" label="Ngày kết thúc">  
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

export default CreateBulkPurchasePromotion;
