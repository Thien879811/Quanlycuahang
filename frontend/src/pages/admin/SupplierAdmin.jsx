import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Typography, Tag, Descriptions, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import factoryService from '../../services/factory.service';
import { handleResponse } from '../../functions';
import * as XLSX from 'xlsx';

const { Title } = Typography;

const SupplierAdmin = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [form] = Form.useForm();
    const [editingSupplier, setEditingSupplier] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await factoryService.getAll();
            const data = handleResponse(response);
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            message.error('Không thể tải danh sách nhà cung cấp');
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

    const showDetailModal = (supplier) => {
        setSelectedSupplier(supplier);
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

    const columns = [
        {
            title: 'Tên nhà cung cấp',
            dataIndex: 'factory_name',
            key: 'factory_name',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Đang trả hàng' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Đang giao',
            dataIndex: 'onTheWay',
            key: 'onTheWay',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3}>Nhà cung cấp</Title>
                <Space>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => showModal()}>
                        Thêm nhà cung cấp
                    </Button>
                    <Button>Bộ lọc</Button>
                    <Button icon={<DownloadOutlined />} onClick={handleDownloadExcel}>Tải xuống Excel</Button>
                </Space>
            </div>
            <Table 
                columns={columns} 
                dataSource={suppliers} 
                rowKey="id" 
                pagination={{ 
                    total: suppliers.length,
                    showSizeChanger: false,
                    showQuickJumper: false,
                    showTotal: (total, range) => `Trang ${range[0]}-${range[1]} của ${total}`,
                }}
                onRow={(record) => ({
                    onClick: () => showDetailModal(record),
                })}
            />
            <Modal
                title={editingSupplier ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item name="factory_name" label="Tên nhà cung cấp" rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email hợp lệ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại liên hệ" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingSupplier ? "Cập nhật" : "Thêm nhà cung cấp"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Chi tiết nhà cung cấp"
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
                centered
                bodyStyle={{ padding: '24px' }}
            >
                {selectedSupplier && (
                    <div style={{ background: '#f0f2f5', padding: '24px', borderRadius: '8px' }}>
                        <Descriptions
                            bordered
                            column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                            labelStyle={{ fontWeight: 'bold', backgroundColor: '#fafafa' }}
                            contentStyle={{ backgroundColor: '#fff' }}
                        >
                            <Descriptions.Item label="Tên nhà cung cấp" span={2}>
                                <Typography.Text strong>{selectedSupplier.factory_name}</Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                <Typography.Text copyable>{selectedSupplier.email}</Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">
                                <Typography.Text copyable>{selectedSupplier.phone}</Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {selectedSupplier.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh mục">
                                <Tag color="blue">{selectedSupplier.category}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={selectedSupplier.status === 'Đang trả hàng' ? 'green' : 'red'}>
                                    {selectedSupplier.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Đang giao" span={2}>
                                <Typography.Text type="warning" strong>{selectedSupplier.onTheWay}</Typography.Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sản phẩm" span={2}>
                                <List
                                    dataSource={selectedSupplier.products}
                                    renderItem={product => (
                                        <List.Item>
                                            <Typography.Text strong>{product.product_name}</Typography.Text>
                                            <Typography.Text type="secondary"> - Số lượng: {product.quantity}</Typography.Text>
                                        </List.Item>
                                    )}
                                    bordered
                                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                                />
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default SupplierAdmin;