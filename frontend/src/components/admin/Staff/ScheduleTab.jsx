import React, { useState, useEffect } from 'react';
import { Table, DatePicker, TimePicker, Button, message, Space, Select, Row, Col, Modal, Form, Input, Popconfirm, Card, Typography, Divider } from 'antd';
import { PlusOutlined, SaveOutlined, UserAddOutlined, ScheduleOutlined, LeftOutlined, RightOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddEmployeeModal from './Modal/AddEmployeeModal';
import AddTaskModal from './Modal/AddTaskModal';
import employeeService from '../../../services/employee.service';
import { handleResponse } from '../../../functions';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ScheduleTab = ({ employees, schedules, setSchedules, currentWeek, onChangeWeek, loadData, fetchSchedules, user_id }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter employees based on user_id
  const filteredEmployees = employees.filter(emp => emp.user_id !== null);

  const getPreviousWeek = async () => {
    try {
      const values = await form.validateFields(['employee', 'selectedWeek']);
      const response = await employeeService.getPreviousWeek(
        values.employee,
        values.selectedWeek.clone().startOf('isoWeek').format('YYYY-MM-DD')
      );
      const dataResponse = handleResponse(response);

      
      if(dataResponse.success) {
        const prevSchedules = dataResponse.data;
        
        // Áp dụng lịch trình cũ vào form
        prevSchedules.forEach(schedule => {
          const scheduleDate = moment(schedule.date);
          const dayIndex = scheduleDate.day() - 1; // Trừ 1 vì thứ 2 là ngày đầu tuần (index 0)
          
          if(dayIndex >= 0) { // Chỉ áp dụng cho các ngày từ thứ 2-CN
            form.setFieldsValue({
              [`time_start_${dayIndex}`]: moment(schedule.time_start, 'HH:mm'),
              [`time_end_${dayIndex}`]: moment(schedule.time_end, 'HH:mm'),
              [`reason_${dayIndex}`]: schedule.reason
            });
          }
        });
        
        message.success('Đã áp dụng lịch trình tuần trước');
      } else {
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error fetching previous week:', error);
    }
  };

  const handleEdit = (record) => {
    setEditingSchedule(record);
    form.setFieldsValue({
      date: moment(record.date),
      time_start: moment(record.time_start, 'HH:mm'),
      time_end: moment(record.time_end, 'HH:mm'),
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
        time_start: values.time_start.format('HH:mm'),
        time_end: values.time_end.format('HH:mm'),
      };

      console.log(updatedSchedule);

      const response = await employeeService.updateWorkingSchedule(updatedSchedule.id, updatedSchedule);
      const dataResponse = handleResponse(response);

      if(dataResponse.success) {
        message.success(dataResponse.message);
        loadData();
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
        loadData();
      } else {
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleScheduleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const schedules = Array.from({ length: 7 }, (_, i) => {
        const date = selectedWeek.clone().add(i, 'days');
        const time_start = values[`time_start_${i}`];
        const time_end = values[`time_end_${i}`];
        
        return time_start && time_end ? {
          date: date.format('YYYY-MM-DD'),
          time_start: time_start.format('HH:mm'),
          time_end: time_end.format('HH:mm'),
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
        loadData();
        message.success(dataResponse.message);
        setIsScheduleModalVisible(false);
        form.resetFields();
      } else {
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
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
      title: currentWeek.clone().startOf('isoWeek').add(i, 'days').format('DD/MM (ddd)'),
      dataIndex: `day${i}`,
      key: `day${i}`,
      width: 180,
      render: (_, record) => {
        const daySchedules = schedules?.filter(
          s => s.staff_id === record.id && 
          moment(s.date).isSame(currentWeek.clone().startOf('isoWeek').add(i, 'days'), 'day')
        );

        if (!daySchedules?.length) return null;

        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {daySchedules.map(schedule => (
              <Card 
                key={schedule.id} 
                size="small" 
                style={{ 
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '1px solid #f0f0f0'
                }}
                hoverable
              >
                <Space direction="vertical" size={4}>
                  <Text strong style={{ color: '#1890ff', fontSize: '13px' }}>
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    {`${schedule.time_start} - ${schedule.time_end}`}
                  </Text>
                  {schedule.reason && (
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <FileTextOutlined style={{ marginRight: 6 }} />
                      {schedule.reason}
                    </Text>
                  )}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space size="small">
                    <Button 
                      type="primary"
                      ghost
                      icon={<EditOutlined />} 
                      onClick={() => handleEdit(schedule)} 
                      size="small"
                      style={{ fontSize: '12px', borderRadius: '6px' }}
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
                        style={{ fontSize: '12px', borderRadius: '6px' }}
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
    <Card style={{ width: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={4} style={{ fontSize: '20px', margin: 0 }}>Lịch làm việc nhân viên</Title>
            </Space>
          </Col>
          <Col>
            <Space size="middle">
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => setIsScheduleModalVisible(true)}
                size="middle"
                style={{ borderRadius: '6px', height: '38px' }}
              >
                Thêm lịch trình
              </Button>
              <Select
                style={{ width: 180, borderRadius: '6px' }}
                placeholder="Chọn nhân viên"
                onChange={setSelectedEmployee}
                allowClear
                size="middle"
              >
                {filteredEmployees.map((employee) => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.name}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
        
        <Row justify="space-between" align="middle" style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
          <Col>
            <Button 
              type="default"
              icon={<LeftOutlined />} 
              onClick={() => onChangeWeek(currentWeek.clone().subtract(1, 'week'))}
              size="middle"
              style={{ borderRadius: '6px' }}
            >
              Tuần trước
            </Button>
          </Col>
          <Col>
            <RangePicker
              value={[currentWeek.clone().startOf('isoWeek'), currentWeek.clone().startOf('isoWeek').endOf('week')]}
              format="DD/MM/YYYY"
              disabled
              style={{ width: '280px', borderRadius: '6px' }}
              size="middle"
            />
          </Col>
          <Col>
            <Button 
              type="default"
              icon={<RightOutlined />} 
              onClick={() => onChangeWeek(currentWeek.clone().add(1, 'week'))}
              size="middle"
              style={{ borderRadius: '6px' }}
            >
              Tuần sau
            </Button>
          </Col>
        </Row>

        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={false}
          bordered
          size="middle"
          style={{ marginTop: '12px' }}
        />

        <Modal
          title={
            <Space align="center">
              <ScheduleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <Title level={4} style={{ fontSize: '18px', margin: 0 }}>Thêm lịch trình cho nhân viên</Title>
            </Space>
          }
          visible={isScheduleModalVisible}
          onOk={handleScheduleModalOk}
          onCancel={() => {
            setIsScheduleModalVisible(false);
            form.resetFields();
          }}
          width={1000}
          okText="Lưu lịch trình"
          cancelText="Hủy"
          style={{ top: 90 }}
        >
          <Form form={form} layout="vertical" size="middle">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="employee"
                  label="Chọn nhân viên"
                  rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                >
                  <Select placeholder="Chọn nhân viên" style={{ borderRadius: '6px' }}>
                    {filteredEmployees.map(employee => (
                      <Option key={employee.id} value={employee.id}>
                        {employee.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="selectedWeek"
                  label="Chọn tuần"
                  rules={[{ required: true, message: 'Vui lòng chọn tuần' }]}
                >
                  <DatePicker
                    picker="week"
                    onChange={date => setSelectedWeek(date?.startOf('week'))}
                    style={{ width: '100%', borderRadius: '6px' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button 
              type="primary" 
              onClick={getPreviousWeek}
              icon={<CalendarOutlined />}
              style={{ marginBottom: '16px', borderRadius: '6px' }}
            >
              Lấy lịch trình tuần trước
            </Button>

            <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 4px' }}>
              {selectedWeek && Array.from({ length: 7 }, (_, i) => (
                <Card 
                  key={i} 
                  style={{ 
                    marginBottom: '16px', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }} 
                  size="small"
                >
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item 
                        label={
                          <Space>
                            <CalendarOutlined style={{ color: '#1890ff' }} />
                            {`Ngày ${selectedWeek.clone().startOf('isoWeek').add(i, 'days').format('DD/MM (ddd)')}`}
                          </Space>
                        }
                      >
                        <Input 
                          disabled 
                          value={selectedWeek.clone().startOf('isoWeek').add(i, 'days').format('DD/MM/YYYY')}
                          style={{ borderRadius: '6px' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Row gutter={8}>
                        <Col span={12}>
                          <Form.Item 
                            name={`time_start_${i}`} 
                            label={
                              <Space>
                                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                                Giờ bắt đầu
                              </Space>
                            }
                          >
                            <TimePicker format="HH:mm" style={{ width: '100%', borderRadius: '6px' }} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item 
                            name={`time_end_${i}`} 
                            label={
                              <Space>
                                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                                Giờ kết thúc
                              </Space>
                            }
                          >
                            <TimePicker format="HH:mm" style={{ width: '100%', borderRadius: '6px' }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={8}>
                      <Form.Item 
                        name={`reason_${i}`} 
                        label={
                          <Space>
                            <FileTextOutlined style={{ color: '#1890ff' }} />
                            Ghi chú
                          </Space>
                        }
                      >
                        <Input.TextArea 
                          rows={2} 
                          style={{ borderRadius: '6px' }}
                          placeholder="Nhập ghi chú nếu có..."
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Form>
        </Modal>

        <Modal
          title={
            <Space align="center">
              <EditOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <Title level={4} style={{ fontSize: '18px', margin: 0 }}>Chỉnh sửa lịch trình</Title>
            </Space>
          }
          visible={isEditModalVisible}
          onOk={handleEditModalOk}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingSchedule(null);
            form.resetFields();
          }}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          width={520}
        >
          {editingSchedule && (
            <Form form={form} layout="vertical" size="middle">
              <Form.Item
                name="date"
                label={
                  <Space>
                    <CalendarOutlined style={{ color: '#1890ff' }} />
                    Ngày
                  </Space>
                }
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker style={{ width: '100%', borderRadius: '6px' }} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="time_start"
                    label={
                      <Space>
                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                        Giờ bắt đầu
                      </Space>
                    }
                    rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%', borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="time_end"
                    label={
                      <Space>
                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                        Giờ kết thúc
                      </Space>
                    }
                    rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%', borderRadius: '6px' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item 
                name="reason" 
                label={
                  <Space>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                    Ghi chú
                  </Space>
                }
              >
                <Input.TextArea 
                  rows={3} 
                  style={{ borderRadius: '6px' }}
                  placeholder="Nhập ghi chú nếu có..."
                />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Space>
    </Card>
  );
};

export default ScheduleTab;
