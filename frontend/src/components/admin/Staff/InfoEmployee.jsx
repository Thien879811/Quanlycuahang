import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import EmployeeService from '../../../services/employee.service';

const InfoEmployee = ({ employees, setEmployees }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tuổi',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Lương',
            dataIndex: 'salary',
            key: 'salary',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
            ),
        },
    ];

    const handleEdit = (record) => {
        setIsEditing(true);
        setEditingEmployee(record);
        form.setFieldsValue(record);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const updatedEmployee = { ...editingEmployee, ...values };
            const response = await EmployeeService.update(editingEmployee.id, updatedEmployee);
            if (response.status === 200) {
                setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
                setIsEditing(false);
                setEditingEmployee(null);
                message.success('Cập nhật thông tin nhân viên thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin nhân viên');
        }
    };

    return (
        <div className="employee-info">
            <h2>Thông tin nhân viên</h2>
            <Table dataSource={employees} columns={columns} rowKey="id" />
            <Modal
                title="Chỉnh sửa thông tin nhân viên"
                visible={isEditing}
                onOk={handleSave}
                onCancel={() => {
                    setIsEditing(false);
                    setEditingEmployee(null);
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="age" label="Tuổi" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nữ">Nữ</Select.Option>
                            <Select.Option value="Khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="salary" label="Lương" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InfoEmployee;
