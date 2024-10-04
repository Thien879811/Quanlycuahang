import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Input, Modal, Form, DatePicker, InputNumber, Row, Col, Select, Card, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import usePromotion from '../../../utils/promorionUtils';
import moment from 'moment';

const { Title } = Typography;

function PromotionList() {
    const { promotions, deletePromotion, updatePromotion, fetchPromotion } = usePromotion();
    const [searchText, setSearchText] = useState('');
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [form] = Form.useForm();
    const [filterType, setFilterType] = useState(null);
    const [filterMonth, setFilterMonth] = useState(null);

    const columns = [
        { title: 'Loại khuyến mãi', dataIndex: 'catalory', key: 'catalory' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Mã', dataIndex: 'code', key: 'code' },
        { title: 'Giảm giá (%)', dataIndex: 'discount_percentage', key: 'discount_percentage' },
        { title: 'ID sản phẩm', dataIndex: 'product_id', key: 'product_id' },
        { title: 'Quà tặng', dataIndex: 'present', key: 'present' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Ngày bắt đầu', dataIndex: 'start_date', key: 'start_date' },
        { title: 'Ngày kết thúc', dataIndex: 'end_date', key: 'end_date' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa khuyến mãi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button icon={<DeleteOutlined />} danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (promotion) => {
        const editableFields = Object.keys(promotion).filter(key => promotion[key] !== null && promotion[key] !== undefined && promotion[key] !== '');
        const editablePromotion = {};
        editableFields.forEach(field => {
            editablePromotion[field] = promotion[field];
        });
        setEditingPromotion(editablePromotion);
        form.setFieldsValue({
            ...editablePromotion,
            start_date: editablePromotion.start_date ? moment(editablePromotion.start_date) : null,
            end_date: editablePromotion.end_date ? moment(editablePromotion.end_date) : null,
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
    }, []);

    return (
        <Card>
            <Title level={2}>Danh sách khuyến mãi</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={24} md={8}>
                    <Input.Search
                        placeholder="Tìm kiếm khuyến mãi"
                        onChange={(e) => handleSearch(e.target.value)}
                        enterButton={<SearchOutlined />}
                    />
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Lọc theo loại"
                        onChange={handleTypeFilter}
                        allowClear
                    >
                        <Select.Option value="Giảm giá sản phẩm">Giảm giá sản phẩm</Select.Option>
                        <Select.Option value="Voucher">Voucher</Select.Option>
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <DatePicker.MonthPicker
                        style={{ width: '100%' }}
                        placeholder="Lọc theo tháng"
                        onChange={handleMonthFilter}
                    />
                </Col>
            </Row>
            <Table 
                columns={columns} 
                dataSource={filteredPromotions}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
            />
            <Modal
                title="Chỉnh sửa khuyến mãi"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            {editingPromotion && editingPromotion.name !== null && (
                                <Form.Item name="name" label="Tên">
                                    <Input />
                                </Form.Item>
                            )}
                            {editingPromotion && editingPromotion.code !== null && (
                                <Form.Item name="code" label="Mã">
                                    <Input />
                                </Form.Item>
                            )}
                            {editingPromotion && editingPromotion.discount_percentage !== null && (
                                <Form.Item name="discount_percentage" label="Phần trăm giảm giá">
                                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                </Form.Item>
                            )}
                            {editingPromotion && editingPromotion.product_id !== null && (
                                <Form.Item name="product_id" label="ID sản phẩm">
                                    <Input />
                                </Form.Item>
                            )}
                        </Col>
                        <Col xs={24} sm={12}>
                            {editingPromotion && editingPromotion.description !== null && (
                                <Form.Item name="description" label="Mô tả">
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            )}
                            {editingPromotion && editingPromotion.quantity !== null && (
                                <Form.Item name="quantity" label="Số lượng">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            )}
                            {editingPromotion && editingPromotion.start_date !== null && (
                                <Form.Item name="start_date" label="Ngày bắt đầu">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            )}
                            {editingPromotion && editingPromotion.end_date !== null && (
                                <Form.Item name="end_date" label="Ngày kết thúc">
                                    <DatePicker style={{ width: '100%' }} />
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
