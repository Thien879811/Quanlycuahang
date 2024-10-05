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
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Gender',
            dataIndex: 'gioitinh',
            key: 'gioitinh',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await AuthService.deleteUser(id);
            const data = handleResponse(response);
            if (data) {
                message.success('User deleted successfully');
                fetchUsers();
            } else {
                message.error(data.error);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error('Failed to delete user');
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            try {
                if (editingUser) {
                    const response = await AuthService.updateUser(editingUser.id, values);
                    const data = handleResponse(response);
                    if (data) {
                        message.success('User updated successfully');
                    } else {
                        message.error('Failed to update user');
                    }
                } else {
                    const response = await AuthService.createUser(values);
                    const data = handleResponse(response);
                    if (data.user) {
                        message.success('User created successfully');
                    } else {
                        message.error(data.error || 'Failed to create user');
                    }
                }
                setModalVisible(false);
                fetchUsers();
                form.resetFields();
                setEditingUser(null);
            } catch (error) {
                console.error('Error saving user:', error);
                message.error('Failed to save user');
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
                    title={editingUser ? "Edit User" : "Add New User"}
                    visible={modalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    okText={editingUser ? "Update" : "Create"}
                    cancelText="Cancel"
                    width={800}
                >
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Name"
                                    rules={[{ required: true, message: 'Please input the name!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please input the email!' },
                                        { type: 'email', message: 'Please enter a valid email!' }
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
                                    label="Password"
                                    rules={[{ required: !editingUser, message: 'Please input the password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="role"
                                    label="Role"
                                    rules={[{ required: true, message: 'Please select the role!' }]}
                                >
                                    <Select>
                                        <Select.Option value="employee">Employee</Select.Option>
                                        <Select.Option value="admin">Admin</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="age"
                                    label="Age"
                                    rules={[{ required: true, message: 'Please input the age!' }]}
                                >
                                    <Input type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="phone"
                                    label="Phone"
                                    rules={[{ required: true, message: 'Please input the phone number!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="gioitinh"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select the gender!' }]}
                                >
                                    <Select>
                                        <Select.Option value="male">Male</Select.Option>
                                        <Select.Option value="female">Female</Select.Option>
                                        <Select.Option value="other">Other</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please input the address!' }]}
                        >
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item
                            name="position"
                            label="Position"
                            rules={[{ required: true, message: 'Please select the position!' }]}
                        >
                            <Select>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="staff">Staff</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>
        </div>
    );
}