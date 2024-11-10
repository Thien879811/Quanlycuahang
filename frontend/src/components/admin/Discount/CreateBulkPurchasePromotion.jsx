import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, message, Row, Col, Card, Typography, Space, Divider } from 'antd';
import { GiftOutlined, ShoppingCartOutlined, PercentageOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import usePromotion from '../../../utils/promorionUtils';
import useProduct from '../../../utils/productUtils';

const { Option } = Select;
const { Title } = Typography;

function CreateBulkPurchasePromotion() {
    const [form] = Form.useForm();
    const { products } = useProduct();    
    const { createPromotion,fetchPromotions } = usePromotion();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const data = {
                catalory: 'Khuyến mãi mua nhiều',
                name: values.name,
                code: null,
                discount_percentage: values.discountPercentage || null,
                product_id: [values.productId] || null,
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
                fetchPromotions();
            }
        } catch (err) {
            message.error('Không thể tạo khuyến mãi');
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
                    Tạo khuyến mãi mua nhiều
                </Title>

                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item 
                                name="name" 
                                label={
                                    <Space>
                                        <ShoppingCartOutlined />
                                        <span>Tên khuyến mãi</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}
                            >
                                <Input size="large" placeholder="Nhập tên khuyến mãi" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

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
                        <Col span={12}>
                            <Form.Item 
                                name="productId" 
                                label={
                                    <Space>
                                        <ShoppingCartOutlined />
                                        <span>Sản phẩm</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
                            >
                                <Select size="large" placeholder="Chọn sản phẩm">
                                    {products.map((product) => (
                                        <Option key={product.id} value={product.id}>
                                            {product.product_name}
                                        </Option>   
                                    ))}
                                </Select>
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
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả khuyến mãi" />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item 
                                name="quantity" 
                                label={
                                    <Space>
                                        <ShoppingCartOutlined />
                                        <span>Số lượng</span>
                                    </Space>
                                }
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                            >
                                <InputNumber min={0} size="large" style={{ width: '100%' }} placeholder="Nhập số lượng" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item 
                                name="startDate" 
                                label={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Ngày bắt đầu</span>
                                    </Space>
                                }
                            >
                                <DatePicker size="large" style={{ width: '100%' }} placeholder="Chọn ngày bắt đầu" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item 
                                name="endDate" 
                                label={
                                    <Space>
                                        <CalendarOutlined />
                                        <span>Ngày kết thúc</span>
                                    </Space>
                                }
                            >  
                                <DatePicker size="large" style={{ width: '100%' }} placeholder="Chọn ngày kết thúc" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading} 
                            block
                            size="large"
                            icon={<GiftOutlined />}
                        >
                            Tạo khuyến mãi
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </Card>
    );
}

export default CreateBulkPurchasePromotion;
