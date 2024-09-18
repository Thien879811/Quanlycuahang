import React, { useState } from 'react';
import { Table, DatePicker, TimePicker, Button, message, Space, Calendar, Select } from 'antd';
import { PlusOutlined, SaveOutlined, UserAddOutlined, ScheduleOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddEmployeeModal from './Modal/AddEmployeeModal';
import AddTaskModal from './Modal/AddTaskModal';

const { Option } = Select;

const ScheduleTab = ({ employees, schedules, setSchedules }) => {
    console.log(employees, schedules, setSchedules);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);

  // ... (include handleDateChange, handleTimeChange, handleSave, handleAddSchedule, dateCellRender functions)
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

  const handleSave = (record) => {
    // TODO: Implement API call to save the schedule
    console.log('Saving schedule:', record);
    message.success('Schedule saved successfully');
  };

    const handleAddTask = (values) => {
        // TODO: Implement API call to add new task
        console.log('Adding new task:', values);
        setIsAddTaskModalVisible(false);
        message.success('Task added successfully');
        form.resetFields();
        fetchSchedules(); // Refresh the schedule list
    };


      const handleAddEmployee = (values) => {
        // TODO: Implement API call to add new employee
        console.log('Adding new employee:', values);
        setIsAddEmployeeModalVisible(false);
        message.success('Employee added successfully');
        form.resetFields();
        fetchEmployees(); // Refresh the employee list
      };


    const handleAddSchedule = () => {
        const newSchedule = {
        id: schedules.length + 1,
        employeeId: null,
        date: null,
        startTime: null,
        endTime: null,
        };
        setSchedules([...schedules, newSchedule]);
    };

    const dateCellRender = (value) => {
        const listData = schedules.filter(
            (schedule) =>
                schedule.date === value.format('YYYY-MM-DD') &&
                (!selectedEmployee || schedule.employeeId === selectedEmployee)
            );

        return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {listData.map((item) => (
            <li key={item.id}>
                {employees.find((e) => e.id === item.employeeId)?.name}: {item.startTime} - {item.endTime}
            </li>
            ))}
        </ul>
        );
  };
    const columns = [
        {
        title: 'Nhân viên',
        dataIndex: 'name',
        key: 'name',
        },
        {
        title: 'Ngày',
        dataIndex: 'date',
        key: 'date',
        render: (_, record) => (
            <DatePicker
            value={record.date ? moment(record.date) : null}
            onChange={(date) => handleDateChange(record.id, date)}
            />
        ),
        },
        {
        title: 'Giờ bắt đầu',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (_, record) => (
            <TimePicker
            value={record.startTime ? moment(record.startTime, 'HH:mm') : null}
            onChange={(time) => handleTimeChange(record.id, 'startTime', time)}
            format="HH:mm"
            />
        ),
        },
        {
        title: 'Giờ kết thúc',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (_, record) => (
            <TimePicker
            value={record.endTime ? moment(record.endTime, 'HH:mm') : null}
            onChange={(time) => handleTimeChange(record.id, 'endTime', time)}
            format="HH:mm"
            />
        ),
        },
        {
        title: 'Hành động',
        key: 'actions',
        render: (_, record) => (
            <Space>
            <Button icon={<SaveOutlined />} onClick={() => handleSave(record)}>
                Lưu
            </Button>
            </Space>
        ),
        },
    ];

  return (
    <>
        <Space style={{ marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} onClick={handleAddSchedule}>
            Thêm lịch trình
            </Button>
            <Button icon={<UserAddOutlined />} onClick={() => setIsAddEmployeeModalVisible(true)}>
            Thêm nhân viên
            </Button>
            <Button icon={<ScheduleOutlined />} onClick={() => setIsAddTaskModalVisible(true)}>
            Thêm công việc
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
            <Select
            style={{ width: 120 }}
            value={viewMode}
            onChange={setViewMode}
            >
            <Option value="table">Xem dạng bảng</Option>
            <Option value="calendar">Xem dạng lịch</Option>
            </Select>

        </Space>
        {viewMode === 'table' ? (
            <Table
            columns={columns}
            dataSource={schedules.map(s => ({
                ...s,
                name: employees.find(e => e.id === s.employeeId)?.name
            }))}
            rowKey="id"
            />
        ) : (
            <Calendar dateCellRender={dateCellRender} />
        )}
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
    </>
  );
};

export default ScheduleTab;
