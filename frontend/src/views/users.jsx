import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import AuthService from '../services/auth.service';
import { handleResponse } from '../functions';

const { Title } = Typography;

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await AuthService.getAllUser();
            const data = handleResponse(response);
            // Filter out admin users
            const filteredUsers = data.filter(user => user.role !== 'admin');
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Tuổi',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gioitinh',
            key: 'gioitinh',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_, record) => (
                record.role !== 'admin' && (
                    <Space size="middle">
                        <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                    </Space>
                )
            ),
        },
    ];

    const handleEdit = (user) => {
        if (user.role === 'admin') {
            message.error('Không thể chỉnh sửa tài khoản admin');
            return;
        }
        setEditingUser(user);
        form.setFieldsValue(user);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        const user = users.find(u => u.id === id);
        if (user.role === 'admin') {
            message.error('Không thể xóa tài khoản admin');
            return;
        }

        try {
            const response = await AuthService.deleteUser(id);
            const data = handleResponse(response);
            if (data) {
                message.success('Xóa người dùng thành công');
                fetchUsers();
            } else {
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Không thể xóa người dùng');
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                if (editingUser) {
                    if (editingUser.role === 'admin') {
                        message.error('Không thể chỉnh sửa tài khoản admin');
                        return;
                    }
                    const response = await AuthService.updateUser(editingUser.id, values);
                    const data = handleResponse(response);
                    if (data) {
                        message.success('Cập nhật người dùng thành công');
                    } else {
                        message.error('Không thể cập nhật người dùng');
                    }
                } else {
                    const response = await AuthService.createUser(values);
                    const data = handleResponse(response);
                    if (data.user) {
                        message.success('Tạo người dùng thành công');
                    } else {
                        message.error(data.error || 'Không thể tạo người dùng');
                    }
                }
                setModalVisible(false);
                fetchUsers();
                form.resetFields();
                setEditingUser(null);
            } catch (error) {
                console.error('Error saving user:', error);
                message.error('Không thể lưu thông tin người dùng');
            }
        });
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
        setEditingUser(null);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Title level={2}>Quản lý người dùng</Title>
                <Button type="primary" icon={<UserAddOutlined />} onClick={() => setModalVisible(true)}>
                    Thêm mới người dùng
                </Button>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
                <Modal
                    title={editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
                    visible={modalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingUser ? "Cập nhật" : "Tạo mới"}
                    cancelText="Hủy"
                    width={800}
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu"
                                    rules={[{ required: !editingUser, message: 'Vui lòng nhập mật khẩu!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="role"
                                    label="Vai trò"
                                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                                >
                                    <Select>
                                        <Select.Option value="employee">Nhân viên</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="age"
                                    label="Tuổi"
                                    rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                                >
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="phone"
                                    label="Số điện thoại"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="gioitinh"
                                    label="Giới tính"
                                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                >
                                    <Select>
                                        <Select.Option value="male">Nam</Select.Option>
                                        <Select.Option value="female">Nữ</Select.Option>
                                        <Select.Option value="other">Khác</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item
                            name="position"
                            label="Chức vụ"
                            rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
                        >
                            <Select>
                                <Select.Option value="nhanvien">Nhân viên</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="salary"
                            label="Lương"
                            rules={[{ required: true, message: 'Vui lòng nhập lương!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </div>
    );
}