import React, { useState, useEffect } from 'react';
import { Table, DatePicker, TimePicker, Button, message, Space, Select, Row, Col, Modal, Form, Input } from 'antd';
import { PlusOutlined, SaveOutlined, UserAddOutlined, ScheduleOutlined, LeftOutlined, RightOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddEmployeeModal from './Modal/AddEmployeeModal';
import AddTaskModal from './Modal/AddTaskModal';
import employeeService from '../../../services/employee.service';
import { handleResponse } from '../../../functions';
import { fetchAttendances } from '../../../pages/admin/api';
const { Option } = Select;
const { RangePicker } = DatePicker;

const AttendanceTab = ({ employees, attendances }) => {
    const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
    const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [form] = Form.useForm();

    const handleEdit = (record) => {
        setEditingAttendance(record);
        setIsEditModalVisible(true);
    };

    const handleEditModalOk = async () => {
        try {
            const values = await form.validateFields();
            const updatedAttendance = {
                ...editingAttendance,
                ...values,
                date: values.date.format('YYYY-MM-DD'),
                time_start: values.timeRange[0].format('HH:mm:ss'),
                time_end: values.timeRange[1].format('HH:mm:ss'),
            };
            const response = await employeeService.updateAttendance(updatedAttendance.id, updatedAttendance);
            const dataResponse = handleResponse(response);
            if (dataResponse.success) {
                message.success(dataResponse.message);
                setIsEditModalVisible(false);
                fetchAttendances();
            } else {
                message.error(dataResponse.message);
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
            message.error('Failed to update attendance');
        }
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
        setEditingAttendance(null);
    };

    const handleAddAttendance = () => {
        setIsAddAttendanceModalVisible(true);
    };

    const handleAddAttendanceModalOk = async () => {
        try {
            const values = await form.validateFields();
            const newAttendance = {
                staff_id: values.employee,
                date: values.date.format('YYYY-MM-DD'),
                time_start: values.timeRange[0].format('HH:mm:ss'),
                time_end: values.timeRange[1].format('HH:mm:ss'),
                status: values.status,
                reason: values.reason,
            };
            const response = await employeeService.createAttendance(newAttendance);
            const dataResponse = handleResponse(response);
            if (dataResponse.success) {
                message.success(dataResponse.message);
                setIsAddAttendanceModalVisible(false);
                form.resetFields();
                fetchAttendances();
            } else {
                message.error(dataResponse.message);
            }
        } catch (error) {
            console.error('Error adding attendance:', error);
            message.error('Failed to add attendance');
        }
    };

    const handleAddAttendanceModalCancel = () => {
        setIsAddAttendanceModalVisible(false);
        form.resetFields();
    };

    const handlePreviousWeek = () => {
        setCurrentWeek(currentWeek.clone().subtract(1, 'week'));
    };

    const handleNextWeek = () => {
        setCurrentWeek(currentWeek.clone().add(1, 'week'));
    };

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 150,
        },
        ...Array.from({ length: 7 }, (_, i) => ({
            title: currentWeek.clone().add(i, 'days').format('DD/MM (ddd)'),
            dataIndex: `day${i}`,
            key: `day${i}`,
            width: 250,
            render: (_, record) => {
                if (!Array.isArray(attendances)) {
                    console.error('attendances is not an array:', attendances);
                    return null;
                }

                const dayAttendance = attendances.find(
                    a => a.employee_id=== record.id && 
                    moment(a.date).isSame(currentWeek.clone().add(i, 'days'), 'day')
                );

                return dayAttendance ? (
                    <div>
                        <div>{`${dayAttendance.time_start} - ${dayAttendance.time_end}`}</div>
                        {/* <div>{dayAttendance.status}</div>
                        <div>{dayAttendance.reason}</div> */}
                        <Space>
                            <Button icon={<EditOutlined />} onClick={() => handleEdit(dayAttendance)} size="small">
                                Bổ sung
                            </Button>
                        </Space>
                    </div>
                ) : null;
            },
        })),
    ];



    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<PlusOutlined />} onClick={handleAddAttendance}>
                    Thêm chấm công
                </Button>
            </Space>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Button icon={<LeftOutlined />} onClick={handlePreviousWeek}>
                        Tuần trước
                    </Button>
                </Col>
                <Col>
                    <RangePicker
                        value={[currentWeek, currentWeek.clone().endOf('week')]}
                        format="DD/MM/YYYY"
                        disabled
                    />
                </Col>
                <Col>
                    <Button icon={<RightOutlined />} onClick={handleNextWeek}>
                        Tuần sau
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={employees}
                rowKey="id"
            />
            <Modal
                title="Thêm chấm công"
                visible={isAddAttendanceModalVisible}
                onOk={handleAddAttendanceModalOk}
                onCancel={handleAddAttendanceModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="employee"
                        label="Chọn nhân viên"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                        <Select placeholder="Chọn nhân viên">
                            {employees.map(employee => (
                                <Option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Ngày"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="timeRange"
                        label="Thời gian làm việc"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian làm việc' }]}
                    >
                        <TimePicker.RangePicker format="HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Option value="Chưa tính">Chưa tính</Option>
                            <Option value="Có mặt">Có mặt</Option>
                            <Option value="Vắng mặt">Vắng mặt</Option>
                            <Option value="Đi muộn">Đi muộn</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="reason"
                        label="Lý do"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Bổ sung chấm công"
                visible={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                {editingAttendance && (
                    <Form form={form} layout="vertical" initialValues={{
                        date: moment(editingAttendance.date),
                        timeRange: [moment(editingAttendance.time_start, 'HH:mm:ss'), moment(editingAttendance.time_end, 'HH:mm:ss')],
                        status: editingAttendance.status,
                        reason: editingAttendance.reason
                    }}>
                        <Form.Item
                            name="date"
                            label="Ngày"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item
                            name="timeRange"
                            label="Thời gian làm việc"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian làm việc' }]}
                        >
                            <TimePicker.RangePicker format="HH:mm:ss" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Select>
                                <Option value="Chưa tính">Chưa tính</Option>
                                <Option value="Có mặt">Có mặt</Option>
                                <Option value="Vắng mặt">Vắng mặt</Option>
                                <Option value="Đi muộn">Đi muộn</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="reason"
                            label="Lý do"
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </>
    );
};

export default AttendanceTab;