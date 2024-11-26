import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Typography, Tag, Descriptions, List, Statistic, Card, Row, Col, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, ShopOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import factoryService from '../../services/factory.service';
import { handleResponse } from '../../functions';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const SupplierAdmin = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [form] = Form.useForm();
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [historyReceive, setHistoryReceive] = useState({
        total_receipts: 0,
        total_returned_quantity: 0,
        total_amount: 0,
        total_returned_amount: 0,
        net_amount: 0,
        products: []
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        handleSearch(searchText);
    }, [suppliers, searchText]);

    const fetchSuppliers = async () => {
        try {
            const response = await factoryService.getAll();
            const data = handleResponse(response);
            setSuppliers(data);
            setFilteredSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            message.error('Không thể tải danh sách nhà cung cấp');
        }
    };

    const handleSearch = (value) => {
        const searchValue = value.toLowerCase();
        const filtered = suppliers.filter(supplier => 
            supplier.factory_name.toLowerCase().includes(searchValue) ||
            supplier.email.toLowerCase().includes(searchValue) ||
            supplier.phone.toLowerCase().includes(searchValue) ||
            supplier.address.toLowerCase().includes(searchValue)
        );
        setFilteredSuppliers(filtered);
    };

    const fetchHistoryReceive = async (id) => {
        try {
            const response = await factoryService.getHistoryReceive(id);
            const data = handleResponse(response);
            console.log(data);
            setHistoryReceive(data);
        } catch (error) {
            console.error('Error fetching history receive:', error);
        }
    };

    const showModal = (supplier = null) => {
        setEditingSupplier(supplier);
        form.setFieldsValue(supplier || {});
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        let supplier = {
            factory_name: values.factory_name,
            email: values.email,
            phone: values.phone,
            address: values.address,
        };
        try {
            if (editingSupplier) {
                const response = await factoryService.update(editingSupplier.id, supplier);
                const data = handleResponse(response);
                message.success(data.message);
            } else {
                const response = await factoryService.create(supplier);
                const data = handleResponse(response);
                message.success(data.message);
            }
            setIsModalVisible(false);
            form.resetFields();
            fetchSuppliers();
        } catch (error) {
            console.error('Error submitting supplier:', error);
            message.error('Có lỗi xảy ra khi lưu nhà cung cấp');
        }
    };

    const handleDelete = async (id) => {
        try {
            await factoryService.delete(id);
            message.success('Xóa nhà cung cấp thành công');
            fetchSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            message.error('Có lỗi xảy ra khi xóa nhà cung cấp');
        }
    };

    const showDetailModal = async (supplier) => {
        setSelectedSupplier(supplier);
        await fetchHistoryReceive(supplier.id);
        setIsDetailModalVisible(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalVisible(false);
    };

    const handleDownloadExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(suppliers);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
        XLSX.writeFile(workbook, "suppliers.xlsx");
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const columns = [
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'factory_name',
            key: 'factory_name',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => <Space><PhoneOutlined />{text}</Space>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <Space><MailOutlined />{text}</Space>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Đang trả hàng' ? 'success' : 'error'} style={{borderRadius: '15px', padding: '0 15px'}}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Đang giao',
            dataIndex: 'onTheWay',
            key: 'onTheWay',
            render: (value) => <Text type="warning" strong>{value}</Text>
        }
    ];

    return (
        <Card className="supplier-admin-container" style={{ margin: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={3} style={{margin: 0}}><ShopOutlined /> Nhà cung cấp</Title>
                <Space size="middle">
                    <Input
                        placeholder="Tìm kiếm nhà cung cấp..."
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300, borderRadius: '6px' }}
                    />
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => showModal()} style={{borderRadius: '6px'}}>
                        Thêm nhà cung cấp
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={handleDownloadExcel} style={{borderRadius: '6px'}}>
                        Xuất Excel
                    </Button>
                </Space>
            </div>

            <Table 
                columns={columns} 
                dataSource={filteredSuppliers} 
                rowKey="id"
                style={{backgroundColor: 'white', borderRadius: '8px'}}
                pagination={{ 
                    total: filteredSuppliers.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhà cung cấp`,
                    style: {marginTop: '16px'}
                }}
                onRow={(record) => ({
                    onClick: () => showDetailModal(record),
                    style: { cursor: 'pointer' }
                })}
            />

            <Modal
                title={
                    <Space>
                        {editingSupplier ? <EditOutlined /> : <PlusOutlined />}
                        <span>{editingSupplier ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}</span>
                    </Space>
                }
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                style={{top: 20}}
                bodyStyle={{padding: '24px'}}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="factory_name" label="Tên nhà cung cấp" rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}>
                        <Input prefix={<ShopOutlined />} placeholder="Nhập tên nhà cung cấp" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email hợp lệ', type: 'email' }]}>
                        <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                        <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item style={{marginBottom: 0, textAlign: 'right'}}>
                        <Space>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit">
                                {editingSupplier ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <Space>
                        <ShopOutlined />
                        <span>Chi tiết nhà cung cấp</span>
                    </Space>
                }
                visible={isDetailModalVisible}
                onCancel={closeDetailModal}
                footer={[
                    <Button key="close" onClick={closeDetailModal}>
                        Đóng
                    </Button>,
                    <Button key="edit" type="primary" onClick={() => {
                        closeDetailModal();
                        showModal(selectedSupplier);
                    }}>
                        Chỉnh sửa
                    </Button>
                ]}
                width={800}
                height={700}
                centered
                bodyStyle={{ padding: '24px' }}
            >
                {selectedSupplier && (
                    <Card bordered={false} className="supplier-detail-card">
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Card type="inner" title="Thông tin cơ bản">
                                    <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                                        <Descriptions.Item label={<><ShopOutlined /> Tên nhà cung cấp</>}>
                                            <Text strong>{selectedSupplier.factory_name}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<><MailOutlined /> Email</>}>
                                            <Text copyable>{selectedSupplier.email}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                                            <Text copyable>{selectedSupplier.phone}</Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                                            {selectedSupplier.address}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card type="inner" title="Thống kê giao dịch">
                                    <Row gutter={[16, 16]}>
                                        <Col span={8}>
                                            <Statistic 
                                                title="Tổng đơn nhập" 
                                                value={historyReceive.total_receipts}
                                                valueStyle={{color: '#1890ff'}}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic 
                                                title="Số lượng sản phẩm đã trả" 
                                                value={historyReceive.total_returned_quantity}
                                                valueStyle={{color: '#ff4d4f'}}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic 
                                                title="Tổng tiền thực tế"
                                                value={historyReceive.net_amount}
                                                formatter={(value) => formatCurrency(value)}
                                                valueStyle={{color: '#52c41a'}}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card type="inner" title="Danh sách sản phẩm">
                                    <List
                                        dataSource={historyReceive.products}
                                        renderItem={products => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={products.product.product_name}
                                                    description={`Mã sản phẩm: ${products.product.id}`}
                                                />
                                            </List.Item>
                                        )}
                                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                )}
            </Modal>
        </Card>
    );
}

export default SupplierAdmin;