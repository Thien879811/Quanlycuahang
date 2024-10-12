import React, { useState, useEffect } from 'react';
import { Table, DatePicker, TimePicker, Button, message, Space, Select, Row, Col, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, SaveOutlined, UserAddOutlined, ScheduleOutlined, LeftOutlined, RightOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddEmployeeModal from './Modal/AddEmployeeModal';
import AddTaskModal from './Modal/AddTaskModal';
import employeeService from '../../../services/employee.service';
import { handleResponse } from '../../../functions';
const { Option } = Select;
const { RangePicker } = DatePicker;

const ScheduleTab = ({ employees, schedules, setSchedules }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await employeeService.getWorkingScheduleAll();
      const dataResponse = handleResponse(response);
      console.log(dataResponse);
      if(dataResponse.data){
        setSchedules(dataResponse.data);
      }else{
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Failed to fetch schedules');
    }
  };

  const handleDateChange = (id, date) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, date: date ? date.format('YYYY-MM-DD') : null } : s
    ));
  };

  const handleTimeChange = (id, field, time) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, [field]: time ? time.format('HH:mm') : null } : s
    ));
  };

  const handleSave = async (record) => {
    try {
      await employeeService.update(record.id, record);
      message.success('Schedule saved successfully');
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      message.error('Failed to save schedule');
    }
  };

  const handleDelete = async (id) => {
    try {
      const  response = await employeeService.deleteWorkingSchedule(id);
      const dataResponse = handleResponse(response);
      if(dataResponse.success){
        message.success(dataResponse.message);
        fetchSchedules();
      }else{
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      message.error('Failed to delete schedule');
    }
  };

  const handleEdit = (record) => {
    setEditingSchedule(record);
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
      console.log(dataResponse);
      if(dataResponse.success){
        message.success(dataResponse.message);
        setIsEditModalVisible(false);
        fetchSchedules();
      }else{
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      message.error('Failed to update schedule');
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingSchedule(null);
  };

  const handleAddSchedule = () => {
    setIsScheduleModalVisible(true);
    setSelectedWeek(currentWeek);
  };

  const handleScheduleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const schedulePromises = Array.from({ length: 7 }, (_, i) => {
        const date = selectedWeek.clone().add(i, 'days');
        return {
          date: date.format('YYYY-MM-DD'),
          time_start: values[`timeRange_${i}`] ? values[`timeRange_${i}`][0].format('HH:mm') : null,
          time_end: values[`timeRange_${i}`] ? values[`timeRange_${i}`][1].format('HH:mm') : null,
          reason: values[`reason_${i}`] || null,
        };
      });
      
      const data = {
        staff_id: values.employee,
        schedules: schedulePromises,
      }

      const response = await employeeService.createWorkingSchedule(data);
      const dataResponse = handleResponse(response);
    
      if(dataResponse.success){
        message.success(dataResponse.message);
        setIsScheduleModalVisible(false);
        form.resetFields();
        fetchSchedules();
      }else{
        message.error(dataResponse.message);
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      message.error('Failed to add schedule');
    }
  };

  const handleScheduleModalCancel = () => {
    setIsScheduleModalVisible(false);
    form.resetFields();
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek.clone().subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek.clone().add(1, 'week'));
  };

  const handleWeekChange = (date) => {
    if (date) {
      setSelectedWeek(date.startOf('week'));
    } else {
      setSelectedWeek(null);
    }
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
        if (!Array.isArray(schedules)) {
          console.error('schedules is not an array:', schedules);
          return null;
        }

        const daySchedule = schedules.find(
          s => s.staff_id === record.id && 
          moment(s.date).isSame(currentWeek.clone().add(i, 'days'), 'day')
        );

        return daySchedule ? (
          <div>
            <div>{`${daySchedule.time_start} - ${daySchedule.time_end}`}</div>
            <div>{daySchedule.reason}</div>
            <Space>
              <Button icon={<EditOutlined />} onClick={() => handleEdit(daySchedule)} size="small">
                Sửa
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa lịch này?"
                onConfirm={() => handleDelete(daySchedule.id)}
                okText="Có"
                cancelText="Không"
              >
                <Button icon={<DeleteOutlined />} size="small" danger>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          </div>
        ) : null;
      },
    })),
  ];

  const dataSource = employees.map(employee => ({
    id: employee.id,
    name: employee.name,
  }));

  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await axios.post('/api/employees', employeeData);
      message.success('Employee added successfully');
      setIsAddEmployeeModalVisible(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      message.error('Failed to add employee');
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData);
      message.success('Task added successfully');
      setIsAddTaskModalVisible(false);
    } catch (error) {
      console.error('Error adding task:', error);
      message.error('Failed to add task');
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '83%' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<PlusOutlined />} onClick={handleAddSchedule}>
          Thêm lịch trình cho nhân viên
        </Button>
        <Select
          style={{ width: 200 }}
          placeholder="Chọn nhân viên"
          onChange={setSelectedEmployee}
          allowClear
        >
          {employees.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name}
            </Option>
          ))}
        </Select>
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
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
      <AddEmployeeModal
        visible={isAddEmployeeModalVisible}
        onCancel={() => setIsAddEmployeeModalVisible(false)}
        onAddEmployee={handleAddEmployee}
      />
      <AddTaskModal
        visible={isAddTaskModalVisible}
        onCancel={() => setIsAddTaskModalVisible(false)}
        onAddTask={handleAddTask}
        employees={employees}
      />
      <Modal
        title="Thêm lịch trình cho nhân viên"
        visible={isScheduleModalVisible}
        onOk={handleScheduleModalOk}
        onCancel={handleScheduleModalCancel}
        width={800}
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
            name="selectedWeek"
            label="Chọn tuần"
            rules={[{ required: true, message: 'Vui lòng chọn tuần' }]}
          >
            <DatePicker
              picker="week"
              onChange={handleWeekChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
          {selectedWeek && Array.from({ length: 7 }, (_, i) => (
            <Row key={i} gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={`date_${i}`}
                  label={`Ngày ${selectedWeek.clone().add(i, 'days').format('DD/MM (ddd)')}`}
                >
                  <Input disabled value={selectedWeek.clone().add(i, 'days').format('DD/MM/YYYY')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={`timeRange_${i}`}
                  label="Thời gian làm việc"
                >
                  <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={`reason_${i}`}
                  label="Lý do"
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal>
      <Modal
        title="Chỉnh sửa lịch trình"
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        {editingSchedule && (
          <Form form={form} layout="vertical" initialValues={{
            date: moment(editingSchedule.date),
            timeRange: [moment(editingSchedule.time_start, 'HH:mm'), moment(editingSchedule.time_end, 'HH:mm')],
            reason: editingSchedule.reason
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
              <TimePicker.RangePicker format="HH:mm" />
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
  );
};

export default ScheduleTab;
