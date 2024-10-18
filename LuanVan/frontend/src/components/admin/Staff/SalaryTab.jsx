import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Form, Input, DatePicker, Select, Space, InputNumber } from 'antd';
import moment from 'moment';
import EmployeeService from '../../../services/employee.service';
import {fetchSalaries} from '../../../pages/admin/api/index';

const { Option } = Select;

const SalaryTab = ({ employees, salaries }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [form] = Form.useForm();
    const [isCreateSalaryModalVisible, setIsCreateSalaryModalVisible] = useState(false);
    const [createSalaryForm] = Form.useForm();



    const salaryColumns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tháng',
            dataIndex: 'mouth',
            key: 'mouth',
            render: (text) => moment(text).format('MM/YYYY'),
        },
        {
            title: 'Lương cơ bản',
            dataIndex: 'bassic_wage',
            key: 'bassic_wage',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: 'Ngày công',
            dataIndex: 'work_day',
            key: 'work_day',
             
        },
        {
            title: 'Làm thêm',
            dataIndex: 'overtime',
            key: 'overtime',
            render: (text) => text + ' giờ',
        },
        {
            title: 'Lương làm thêm',
            dataIndex: 'salary_overtime',
            key: 'salary_overtime',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
        {
            title: 'Tổng lương',
            dataIndex: 'total',
            key: 'total',
            render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
        },
    ];

    const handleAdvance = (record) => {
        setCurrentEmployee(record);
        setIsModalVisible(true);
    };

    const handleCalculate = (record) => {
        const data = {
            employeeId: record.employeeId,
            month: moment(record.month).format('YYYY-MM-DD'),
        }
        console.log(data);
        EmployeeService.createSalary(data)
            .then(() => {
                message.success('Lương đã được tính toán');
            })
            .catch((error) => {
                message.error('Có lỗi xảy ra khi tính lương');
                console.error(error);
            });
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            console.log('Yêu cầu ứng lương:', { ...values, employeeId: currentEmployee.employeeId });
            message.success('Yêu cầu ứng lương đã được ghi nhận');
            setIsModalVisible(false);
            form.resetFields();
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleCreateSalary = () => {
        setIsCreateSalaryModalVisible(true);
    };

    const handleCreateSalaryModalOk =  () => {
        createSalaryForm.validateFields().then(async (values) => {
            const data = {
                employeeIds: values.employees,
                month: values.month,
            }
            const response = await EmployeeService.createSalary(data)
                .then(() => {
                    message.success('Bảng lương đã được tạo');
                    setIsCreateSalaryModalVisible(false);
                    createSalaryForm.resetFields();
                })
                .catch((error) => {
                    message.error('Có lỗi xảy ra khi tạo bảng lương');
                    console.error(error);
                });

            fetchSalaries();
        }).catch((info) => {
            console.log('Validate Failed:', info);
        });
    };

    const handleCreateSalaryModalCancel = () => {
        setIsCreateSalaryModalVisible(false);
        createSalaryForm.resetFields();
    };

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={handleCreateSalary}>Tạo bảng lương tạm thời</Button>
            </Space>
            <Table
                columns={salaryColumns}
                dataSource={salaries.map(s => ({
                    ...s,
                    name: employees.find(e => e.id === s.employee_id)?.name
                }))}
                rowKey="id"
            />
            <Modal
                title="Yêu cầu ứng lương"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="amount" label="Số tiền ứng" rules={[{ required: true, message: 'Vui lòng nhập số tiền ứng' }]}>
                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                    </Form.Item>
                    <Form.Item name="date" label="Ngày ứng" rules={[{ required: true, message: 'Vui lòng chọn ngày ứng' }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="reason" label="Lý do" rules={[{ required: true, message: 'Vui lòng nhập lý do ứng lương' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="paymentMethod" label="Phương thức thanh toán" rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}>
                        <Select>
                            <Option value="cash">Tiền mặt</Option>
                            <Option value="bank">Chuyển khoản</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Tạo bảng lương tạm thời"
                visible={isCreateSalaryModalVisible}
                onOk={handleCreateSalaryModalOk}
                onCancel={handleCreateSalaryModalCancel}
            >
                <Form form={createSalaryForm} layout="vertical">
                    <Form.Item name="month" label="Tháng" initialValue={moment()} rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="employees" label="Nhân viên" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một nhân viên' }]}>
                        <Select 
                            mode="multiple" 
                            placeholder="Chọn nhân viên"
                        >
                            {employees.map(employee => (
                                <Option key={employee.id} value={employee.id}>{employee.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SalaryTab;
