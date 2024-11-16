import React, { useState, useEffect } from 'react';
import { Table, DatePicker, TimePicker, Button, message, Space, Select, Row, Col, Modal, Form, Input, Popconfirm, Card, Typography } from 'antd';
import { PlusOutlined, SaveOutlined, UserAddOutlined, ScheduleOutlined, LeftOutlined, RightOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddEmployeeModal from './Modal/AddEmployeeModal';
import AddTaskModal from './Modal/AddTaskModal';
import employeeService from '../../../services/employee.service';
import { handleResponse } from '../../../functions';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ScheduleTab = ({ employees, schedules, setSchedules, currentWeek, onChangeWeek }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = (record) => {
    setEditingSchedule(record);
    form.setFieldsValue({
      date: moment(record.date),
      timeRange: [moment(record.time_start, 'HH:mm'), moment(record.time_end, 'HH:mm')],
      reason: record.reason
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedSchedule = {
        ...editingSchedule,
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time_start: values.timeRange[0].format('HH:mm'),
        time_end: values.timeRange[1].format('HH:mm'),
      };

      const response = await employeeService.updateWorkingSchedule(updatedSchedule.id, updatedSchedule);
      const dataResponse = handleResponse(response);

      if(dataResponse.success) {
        message.success(dataResponse.message);
        setIsEditModalVisible(false);
        form.resetFields();
        setEditingSchedule(null);
      } else {
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      message.error('Failed to update schedule');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await employeeService.deleteWorkingSchedule(id);
      const dataResponse = handleResponse(response);
      
      if(dataResponse.success) {
        message.success(dataResponse.message);
        fetchSchedules();
      } else {
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      message.error('Failed to delete schedule');
    }
  };

  const handleScheduleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const schedules = Array.from({ length: 7 }, (_, i) => {
        const date = selectedWeek.clone().add(i, 'days');
        const timeRange = values[`timeRange_${i}`];
        
        return timeRange ? {
          date: date.format('YYYY-MM-DD'),
          time_start: timeRange[0].format('HH:mm'),
          time_end: timeRange[1].format('HH:mm'),
          reason: values[`reason_${i}`] || null,
        } : null;
      }).filter(Boolean);

      if (schedules.length === 0) {
        message.error('Please add at least one schedule');
        return;
      }

      const data = {
        staff_id: values.employee,
        schedules
      };

      const response = await employeeService.createWorkingSchedule(data);
      const dataResponse = handleResponse(response);
    
      if(dataResponse.success) {
        message.success(dataResponse.message);
        setIsScheduleModalVisible(false);
        form.resetFields();
        fetchSchedules();
      } else {
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      message.error('Failed to add schedule');
    }
  };

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 120,
      render: (text) => <Text strong>{text}</Text>
    },
    ...Array.from({ length: 7 }, (_, i) => ({
      title: currentWeek.clone().add(i, 'days').format('DD/MM (ddd)'),
      dataIndex: `day${i}`,
      key: `day${i}`,
      width: 180,
      render: (_, record) => {
        const daySchedules = schedules?.filter(
          s => s.staff_id === record.id && 
          moment(s.date).isSame(currentWeek.clone().add(i, 'days'), 'day')
        );

        if (!daySchedules?.length) return null;

        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {daySchedules.map(schedule => (
              <Card 
                key={schedule.id} 
                size="small" 
                style={{ 
                  borderRadius: '6px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                <Space direction="vertical" size={2}>
                  <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {`${schedule.time_start} - ${schedule.time_end}`}
                  </Text>
                  {schedule.reason && (
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {schedule.reason}
                    </Text>
                  )}
                  <Space size="small">
                    <Button 
                      type="primary"
                      ghost
                      icon={<EditOutlined />} 
                      onClick={() => handleEdit(schedule)} 
                      size="small"
                      style={{ fontSize: '11px', padding: '0 4px' }}
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa lịch này?"
                      onConfirm={() => handleDelete(schedule.id)}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button 
                        danger 
                        ghost 
                        icon={<DeleteOutlined />} 
                        size="small"
                        style={{ fontSize: '11px', padding: '0 4px' }}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
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
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ fontSize: '18px', margin: 0 }}>Lịch làm việc nhân viên</Title>
          </Col>
          <Col>
            <Space size="small">
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => setIsScheduleModalVisible(true)}
                size="middle"
              >
                Thêm lịch trình
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
              onClick={() => onChangeWeek(currentWeek.clone().subtract(1, 'week'))}
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
              style={{ width: '240px' }}
              size="middle"
            />
          </Col>
          <Col>
            <Button 
              type="default"
              icon={<RightOutlined />} 
              onClick={() => onChangeWeek(currentWeek.clone().add(1, 'week'))}
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
          scroll={{ x: 'max-content' }}
          pagination={false}
          bordered
          size="small"
          style={{ marginTop: '12px' }}
        />

        <Modal
          title={<Title level={4} style={{ fontSize: '16px', margin: 0 }}>Thêm lịch trình cho nhân viên</Title>}
          visible={isScheduleModalVisible}
          onOk={handleScheduleModalOk}
          onCancel={() => {
            setIsScheduleModalVisible(false);
            form.resetFields();
          }}
          width={720}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical" size="middle">
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
              name="selectedWeek"
              label="Chọn tuần"
              rules={[{ required: true, message: 'Vui lòng chọn tuần' }]}
            >
              <DatePicker
                picker="week"
                onChange={date => setSelectedWeek(date?.startOf('week'))}
                style={{ width: '100%' }}
              />
            </Form.Item>

            {selectedWeek && Array.from({ length: 7 }, (_, i) => (
              <Card key={i} style={{ marginBottom: '12px' }} size="small">
                <Row gutter={12}>
                  <Col span={8}>
                    <Form.Item label={`Ngày ${selectedWeek.clone().add(i, 'days').format('DD/MM (ddd)')}`}>
                      <Input disabled value={selectedWeek.clone().add(i, 'days').format('DD/MM/YYYY')} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={`timeRange_${i}`} label="Thời gian làm việc">
                      <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={`reason_${i}`} label="Lý do">
                      <Input.TextArea rows={2} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            ))}
          </Form>
        </Modal>

        <Modal
          title={<Title level={4} style={{ fontSize: '16px', margin: 0 }}>Chỉnh sửa lịch trình</Title>}
          visible={isEditModalVisible}
          onOk={handleEditModalOk}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingSchedule(null);
            form.resetFields();
          }}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          width={480}
        >
          {editingSchedule && (
            <Form form={form} layout="vertical" size="middle">
              <Form.Item
                name="date"
                label="Ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="timeRange"
                label="Thời gian làm việc"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian làm việc' }]}
              >
                <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="reason" label="Lý do">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Space>
    </Card>
  );
};

export default ScheduleTab;
