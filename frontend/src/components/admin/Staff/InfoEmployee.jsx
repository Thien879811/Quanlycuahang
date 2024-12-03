import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag } from 'antd';
import EmployeeService from '../../../services/employee.service';
import { handleResponse } from '../../../functions';

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
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Tag color={record.user_id ? 'green' : 'red'}>
                    {record.user_id ? 'Đang hoạt động' : 'Ngừng truy cập'}
                </Tag>
            ),
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
            const data = {
                names: values.name,
                age: values.age,
                address: values.address,
                phone: values.phone,
                gioitinh: values.gender,
                position_id: values.position,
                salary: values.salary
            };
            const response = await EmployeeService.update(editingEmployee.id, data);
            const dataRes = handleResponse(response);
            if (dataRes.success) {
                const updatedEmployee = { ...editingEmployee, ...values };
                setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
                setIsEditing(false);
                setEditingEmployee(null);
                message.success(dataRes.message);
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
