import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Input, Modal, Form, DatePicker, InputNumber, Row, Col, Select, Card, Typography, Tag, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, GiftOutlined, PercentageOutlined, TagOutlined, ShoppingCartOutlined, CalendarOutlined, FileTextOutlined, NumberOutlined } from '@ant-design/icons';
import usePromotion from '../../../utils/promorionUtils';
import moment from 'moment';
import useProduct from '../../../utils/productUtils';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

function PromotionList({ promotions }) {
    const {deletePromotion, updatePromotion, fetchPromotion } = usePromotion();
    const { products } = useProduct();
    const [searchText, setSearchText] = useState('');
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [form] = Form.useForm();
    const [filterType, setFilterType] = useState(null);
    const [filterMonth, setFilterMonth] = useState(null);

    const getColumns = (promotions) => {
        const baseColumns = {
            catalory: { 
                title: 'Loại khuyến mãi', 
                dataIndex: 'catalory', 
                key: 'catalory',
                render: (text) => {
                    let color = text === 'Voucher' ? 'blue' : 'green';
                    let icon = text === 'Voucher' ? <TagOutlined /> : <PercentageOutlined />;
                    if (text === '1') {
                        color = 'purple';
                        icon = <GiftOutlined />;
                        text = 'Giảm giá sản phẩm';
                    }
                    if (text === '2') {
                        color = 'blue';
                        icon = <TagOutlined />;
                        text = 'Voucher';
                    }
                    if (text === '3') {
                        color = 'orange';
                        icon = <ShoppingCartOutlined />;
                        text = 'Giảm giá sản phẩm mua kèm';
                    }
                    if (text === '4') {
                        color = 'red';
                        icon = <ShoppingCartOutlined />;
                        text = 'Khuyến mãi mua nhiều';
                    }
                    return (
                        <Tag color={color} icon={icon}>
                            {text}
                        </Tag>
                    );
                }
            },
            name: { title: 'Tên', dataIndex: 'name', key: 'name' },
            code: { title: 'Mã', dataIndex: 'code', key: 'code' },
            discount_percentage: { 
                title: 'Giảm giá (%)', 
                dataIndex: 'discount_percentage', 
                key: 'discount_percentage',
                render: (text) => text ? `${text}%` : '-'
            },
            product: { 
                title: 'Sản phẩm', 
                dataIndex: 'product', 
                key: 'product',
                render: (product) => product ? product.product_name : '-'
            },
            present: { 
                title: 'Quà tặng', 
                dataIndex: 'present', 
                key: 'present',
                render: (text, record) => {
                    if (text && record.present.product_name) {
                        return <Tag icon={<GiftOutlined />} color="purple">{record.present.product_name}</Tag>;
                    }
                    return '-';
                }
            },
            quantity: { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
            start_date: { 
                title: 'Ngày bắt đầu', 
                dataIndex: 'start_date', 
                key: 'start_date',
                render: (date) => moment(date).format('DD/MM/YYYY')
            },
            end_date: { 
                title: 'Ngày kết thúc', 
                dataIndex: 'end_date', 
                key: 'end_date',
                render: (date) => moment(date).format('DD/MM/YYYY')
            },
            action: {
                title: 'Hành động',
                key: 'action',
                render: (_, record) => (
                    <Space size="middle">
                        <Button type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                            Sửa
                        </Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                        </Popconfirm>
                    </Space>
                ),
            }
        };

        // Kiểm tra xem có dữ liệu nào trong cột không
        const hasData = (field) => {
            return promotions.some(promo => promo[field] !== null && promo[field] !== undefined && promo[field] !== '');
        };

        // Lọc các cột có dữ liệu
        const visibleColumns = Object.entries(baseColumns)
            .filter(([key]) => key === 'action' || hasData(key))
            .map(([_, column]) => column);

        return visibleColumns;
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        form.setFieldsValue({
            ...promotion,
            start_date: promotion.start_date ? moment(promotion.start_date) : null,
            end_date: promotion.end_date ? moment(promotion.end_date) : null,
            product_id: promotion.product ? promotion.product.id : null
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deletePromotion(id);
            message.success('Xóa khuyến mãi thành công');
            fetchPromotion();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa khuyến mãi');
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        filterPromotions(value, filterType, filterMonth);
    };

    const handleTypeFilter = (value) => {
        setFilterType(value);
        filterPromotions(searchText, value, filterMonth);
    };

    const handleMonthFilter = (date, dateString) => {
        setFilterMonth(date);
        filterPromotions(searchText, filterType, date);
    };

    const filterPromotions = (text, type, month) => {
        let filtered = promotions;

        if (text) {
            filtered = filtered.filter(promotion =>
                Object.values(promotion).some(val =>
                    val && val.toString().toLowerCase().includes(text.toLowerCase())
                )
            );
        }

        if (type) {
            filtered = filtered.filter(promotion => promotion.catalory === type);
        }

        if (month) {
            filtered = filtered.filter(promotion => 
                moment(promotion.start_date).format('YYYY-MM') === month.format('YYYY-MM') ||
                moment(promotion.end_date).format('YYYY-MM') === month.format('YYYY-MM')
            );
        }

        setFilteredPromotions(filtered);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedValues = {};
            Object.keys(values).forEach(key => {
                if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
                    updatedValues[key] = values[key];
                }
            });
            if (updatedValues.start_date) {
                updatedValues.start_date = updatedValues.start_date.format('YYYY-MM-DD');
            }
            if (updatedValues.end_date) {
                updatedValues.end_date = updatedValues.end_date.format('YYYY-MM-DD');
            }
            await updatePromotion(editingPromotion.id, updatedValues);
            setIsModalVisible(false);
            message.success('Cập nhật khuyến mãi thành công');
            fetchPromotion();
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật khuyến mãi');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        setFilteredPromotions(promotions);
    }, [promotions]);

    useEffect(() => {
        fetchPromotion();
    }, [promotions]);

    const getPromotionsByCategory = (category) => {
        return filteredPromotions.filter(promotion => {
            switch (promotion.catalory) {
                case '1':
                    return category === 'Giảm giá sản phẩm';
                case '2':
                    return category === 'Voucher';
                case '3':
                    return category === 'Giảm giá sản phẩm mua kèm';
                case '4':
                    return category === 'Khuyến mãi mua nhiều';
                default:
                    return false;
            }
        });
    };

    return (
        <Card className="promotion-list-card" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Title level={2} style={{ marginBottom: '24px', color: '#1890ff' }}>Danh sách khuyến mãi</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={24} md={8}>
                    <Input.Search
                        placeholder="Tìm kiếm khuyến mãi"
                        onChange={(e) => handleSearch(e.target.value)}
                        enterButton={<SearchOutlined />}
                        size="large"
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <DatePicker.MonthPicker
                        style={{ width: '100%' }}
                        placeholder="Lọc theo tháng"
                        onChange={handleMonthFilter}
                        size="large"
                    />
                </Col>
            </Row>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Giảm giá sản phẩm" key="1">
                    <Table 
                        columns={getColumns(getPromotionsByCategory('Giảm giá sản phẩm'))} 
                        dataSource={getPromotionsByCategory('Giảm giá sản phẩm')}
                        rowKey="id"
                        pagination={{ 
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khuyến mãi`
                        }}
                        scroll={{ x: true }}
                        bordered
                    />
                </TabPane>
                <TabPane tab="Voucher" key="2">
                    <Table 
                        columns={getColumns(getPromotionsByCategory('Voucher'))} 
                        dataSource={getPromotionsByCategory('Voucher')}
                        rowKey="id"
                        pagination={{ 
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khuyến mãi`
                        }}
                        scroll={{ x: true }}
                        bordered
                    />
                </TabPane>
                <TabPane tab="Khuyến mãi mua nhiều" key="3">
                    <Table 
                        columns={getColumns(getPromotionsByCategory('Khuyến mãi mua nhiều'))} 
                        dataSource={getPromotionsByCategory('Khuyến mãi mua nhiều')}
                        rowKey="id"
                        pagination={{ 
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khuyến mãi`
                        }}
                        scroll={{ x: true }}
                        bordered
                    />
                </TabPane>
                <TabPane tab="Giảm giá sản phẩm mua kèm" key="4">
                    <Table 
                        columns={getColumns(getPromotionsByCategory('Giảm giá sản phẩm mua kèm'))} 
                        dataSource={getPromotionsByCategory('Giảm giá sản phẩm mua kèm')}
                        rowKey="id"
                        pagination={{ 
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khuyến mãi`
                        }}
                        scroll={{ x: true }}
                        bordered
                    />
                </TabPane>
            </Tabs>

            <Modal
                title={
                    <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
                        <EditOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>Chỉnh sửa khuyến mãi</Title>
                    </Space>
                }
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                centered
                bodyStyle={{ padding: '24px' }}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        <Col xs={24} sm={12}>
                            {editingPromotion?.name && (
                                <Form.Item 
                                    name="name" 
                                    label={
                                        <Space>
                                            <ShoppingCartOutlined />
                                            <span>Tên khuyến mãi</span>
                                        </Space>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                >
                                    <Input size="large" placeholder="Nhập tên khuyến mãi" />
                                </Form.Item>
                            )}
                            {editingPromotion?.code && (
                                <Form.Item 
                                    name="code" 
                                    label={
                                        <Space>
                                            <TagOutlined />
                                            <span>Mã khuyến mãi</span>
                                        </Space>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập mã!' }]}
                                >
                                    <Input size="large" placeholder="Nhập mã khuyến mãi" />
                                </Form.Item>
                            )}
                            {editingPromotion?.discount_percentage && (
                                <Form.Item 
                                    name="discount_percentage" 
                                    label={
                                        <Space>
                                            <PercentageOutlined />
                                            <span>Phần trăm giảm giá</span>
                                        </Space>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                                >
                                    <InputNumber 
                                        min={0} 
                                        max={100} 
                                        size="large"
                                        style={{ width: '100%' }} 
                                        placeholder="Nhập phần trăm giảm giá"
                                    />
                                </Form.Item>
                            )}
                            {editingPromotion?.product && (
                                <Form.Item 
                                    name="product_id" 
                                    label={
                                        <Space>
                                            <ShoppingCartOutlined />
                                            <span>Sản phẩm</span>
                                        </Space>
                                    }
                                >
                                    <Select size="large" placeholder="Chọn sản phẩm">
                                        {products.map(product => (
                                            <Option key={product.id} value={product.id}>{product.product_name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {editingPromotion?.description && (
                                <Form.Item 
                                    name="description" 
                                    label={
                                        <Space>
                                            <FileTextOutlined />
                                            <span>Mô tả</span>
                                        </Space>
                                    }
                                >
                                    <Input.TextArea 
                                        rows={4} 
                                        placeholder="Nhập mô tả khuyến mãi"
                                        size="large"
                                    />
                                </Form.Item>
                            )}
                            {editingPromotion?.quantity && (
                                <Form.Item 
                                    name="quantity" 
                                    label={
                                        <Space>
                                            <NumberOutlined />
                                            <span>Số lượng</span>
                                        </Space>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                >
                                    <InputNumber 
                                        min={0} 
                                        size="large"
                                        style={{ width: '100%' }} 
                                        placeholder="Nhập số lượng"
                                    />
                                </Form.Item>
                            )}
                            {editingPromotion?.start_date && (
                                <Form.Item 
                                    name="start_date" 
                                    label={
                                        <Space>
                                            <CalendarOutlined />
                                            <span>Ngày bắt đầu</span>
                                        </Space>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                                >
                                    <DatePicker 
                                        style={{ width: '100%' }} 
                                        size="large"
                                        placeholder="Chọn ngày bắt đầu"
                                    />
                                </Form.Item>
                            )}
                            {editingPromotion?.end_date && (
                                <Form.Item 
                                    name="end_date" 
                                    label={
                                        <Space>
                                            <CalendarOutlined />
                                            <span>Ngày kết thúc</span>
                                        </Space>
                                    }
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                                >
                                    <DatePicker 
                                        style={{ width: '100%' }} 
                                        size="large"
                                        placeholder="Chọn ngày kết thúc"
                                    />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Card>
    );
}

export default PromotionList;
