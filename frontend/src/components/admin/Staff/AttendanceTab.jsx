import React, { useState } from 'react';
import { Table, DatePicker, TimePicker, Button, message, Space, Select, Row, Col, Modal, Form, Input, Card, Typography, Alert } from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined, EditOutlined, CalendarOutlined, FileExcelOutlined, CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import employeeService from '../../../services/employee.service';
import { handleResponse } from '../../../functions';
import * as XLSX from 'xlsx';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const AttendanceTab = ({ employees, attendances, currentWeek, onChangeWeek, loadData }) => {
    
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Lọc ra các yêu cầu nghỉ phép chưa được duyệt
    const pendingLeaveRequests = attendances?.filter(a => a.status === '-1') || [];

    const handleApproveLeave = async (attendance) => {
        try {
            const updatedAttendance = {
                ...attendance,
                status: '1' // Cập nhật trạng thái sau khi duyệt
            };
            const response = await employeeService.updateAttendance(attendance.id, updatedAttendance);
            const dataResponse = handleResponse(response);
            if (dataResponse.success) {
                message.success('Đã duyệt đơn nghỉ phép');
                loadData();
            } else {
                message.error(dataResponse.message);
            }
        } catch (error) {
            console.error('Error approving leave request:', error);
            message.error('Không thể duyệt đơn nghỉ phép');
        }
    };

    const handleEdit = (record) => {
        setEditingAttendance(record);
        form.setFieldsValue({
            date: moment(record.date),
            timeRange: [moment(record.time_start, 'HH:mm'), moment(record.time_end, 'HH:mm')],
            status: record.status,
            reason: record.reason
        });
        setIsEditModalVisible(true);
        loadData();
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
                loadData();
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
        form.resetFields();
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
                loadData();
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

    const handleWeekChange = (direction) => {
        setLoading(true);
        const newWeek = direction === 'prev' 
            ? currentWeek.clone().subtract(1, 'week')
            : currentWeek.clone().add(1, 'week');
        onChangeWeek(newWeek);
        setLoading(false);
    };

    const handleExportExcel = (type) => {
        let filteredAttendances = [];
        let fileName = '';

        if (type === 'week') {
            const startOfWeek = currentWeek.clone().startOf('week');
            const endOfWeek = currentWeek.clone().endOf('week');
            
            filteredAttendances = attendances.filter(attendance => 
                moment(attendance.date).isBetween(startOfWeek, endOfWeek, 'day', '[]')
            );
            fileName = `Cham_cong_tuan_${currentWeek.format('DD-MM-YYYY')}.xlsx`;
        } else {
            const startOfMonth = currentWeek.clone().startOf('month');
            const endOfMonth = currentWeek.clone().endOf('month');
            
            filteredAttendances = attendances.filter(attendance => 
                moment(attendance.date).isBetween(startOfMonth, endOfMonth, 'day', '[]')
            );
            fileName = `Cham_cong_thang_${currentWeek.format('MM-YYYY')}.xlsx`;
        }

        const exportData = filteredAttendances.map(attendance => {
            const employee = employees.find(emp => emp.id === attendance.employee_id);
            return {
                'Tên nhân viên': employee?.name || '',
                'Ngày': moment(attendance.date).format('DD/MM/YYYY'),
                'Giờ vào': attendance.time_start,
                'Giờ ra': attendance.time_end,
                'Trạng thái': attendance.status,
                'Lý do': attendance.reason || ''
            };
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Chấm công");
        XLSX.writeFile(wb, fileName);
        message.success('Xuất báo cáo thành công!');
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
                if (!Array.isArray(attendances)) return null;

                const dayAttendances = attendances.filter(
                    a => a.employee_id === record.id && 
                    moment(a.date).isSame(currentWeek.clone().add(i, 'days'), 'day')
                );

                if (!dayAttendances?.length) return null;

                return (
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {dayAttendances.map(attendance => (
                            <Card 
                                key={attendance.id} 
                                size="small" 
                                style={{ 
                                    borderRadius: '6px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Space direction="vertical" size={2}>
                                    <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
                                        <CalendarOutlined style={{ marginRight: 4 }} />
                                        {`${attendance.time_start} - ${attendance.time_end}`}
                                    </Text>
                                    <Space size="small">
                                        <Button 
                                            type="primary"
                                            ghost
                                            icon={<EditOutlined />} 
                                            onClick={() => handleEdit(attendance)} 
                                            size="small"
                                            style={{ fontSize: '11px', padding: '0 4px' }}
                                        >
                                            Sửa
                                        </Button>
                                    </Space>
                                </Space>
                            </Card>
                        ))}
                    </Space>
                );
            },
        })),
    ];

    return (
        <Card style={{ width: '100%', borderRadius: '6px' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {pendingLeaveRequests.length > 0 && (
                    <Alert
                        message={
                            <Space direction="vertical">
                                <Text strong>Yêu cầu nghỉ phép chờ duyệt:</Text>
                                {pendingLeaveRequests.map(request => {
                                    const employee = employees.find(emp => emp.id === request.employee_id);
                                    return (
                                        <Space key={request.id}>
                                            <Text>{employee?.name} - {moment(request.date).format('DD/MM/YYYY')}</Text>
                                            <Text type="secondary">Lý do: {request.reason}</Text>
                                            <Button
                                                type="primary"
                                                size="small"
                                                icon={<CheckOutlined />}
                                                onClick={() => handleApproveLeave(request)}
                                            >
                                                Duyệt
                                            </Button>
                                        </Space>
                                    );
                                })}
                            </Space>
                        }
                        type="info"
                        showIcon
                    />
                )}

                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={4} style={{ fontSize: '18px', margin: 0 }}>Chấm công nhân viên</Title>
                    </Col>
                    <Col>
                        <Space size="small">
                            <Button 
                                type="primary"
                                icon={<FileExcelOutlined />}
                                onClick={() => handleExportExcel('week')}
                                size="middle"
                            >
                                Xuất Excel Tuần
                            </Button>
                            <Button 
                                type="primary"
                                icon={<PlusOutlined />} 
                                onClick={handleAddAttendance}
                                size="middle"
                            >
                                Thêm chấm công
                            </Button>
                            <Select
                                style={{ width: 160 }}
                                placeholder="Chọn nhân viên"
                                onChange={setSelectedEmployee}
                                allowClear
                                size="middle"
                            >
                                {employees.map((employee) => (
                                    <Option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </Option>
                                ))}
                            </Select>
                        </Space>
                    </Col>
                </Row>

                <Row justify="space-between" align="middle">
                    <Col>
                        <Button 
                            type="default"
                            icon={<LeftOutlined />} 
                            onClick={() => handleWeekChange('prev')}
                            size="middle"
                        >
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
                        <Button 
                            type="default"
                            icon={<RightOutlined />}
                            onClick={() => handleWeekChange('next')}
                            size="middle"
                        >
                            Tuần sau
                        </Button>
                    </Col>
                </Row>

                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={employees}
                    rowKey="id"
                    scroll={{ x: true }}
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
                        <Form form={form} layout="vertical">
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
            </Space>
        </Card>
    );
};

export default AttendanceTab;