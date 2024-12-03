import React, { useState, useEffect } from 'react';
import { Tabs, Layout, Typography, Space, Select } from 'antd';
import ScheduleTab from '../../components/admin/Staff/ScheduleTab';
import SalaryTab from '../../components/admin/Staff/SalaryTab';
import InfoEmployee from '../../components/admin/Staff/InfoEmployee';
import AttendanceTab from '../../components/admin/Staff/AttendanceTab';
import { handleResponse } from './api/index';
import employeeService from '../../services/employee.service';
import moment from 'moment';

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const StaffAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [attendances, setAttendances] = useState([]);
  // Khởi tạo tuần hiện tại từ thứ 2
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));
  const [previousSchedules, setPreviousSchedules] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      const data = handleResponse(response);
      if (!data) {
        throw new Error('Invalid response data');
      }

      const employees = data.map(employee => ({
        id: employee.id,
        name: employee.names,
        age: employee.age,
        address: employee.address,
        phone: employee.phone,
        gender: employee.gioitinh,
        position: employee.position,
        user_id: employee.user_id,
        salary: employee.salary,
        created_at: employee.created_at,
        updated_at: employee.updated_at
      }));

      return employees;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await employeeService.getWorkingScheduleAll();
      const data = handleResponse(response);
      return data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  };

  const fetchAttendances = async () => {
    try {
      const response = await employeeService.getAttendance(selectedMonth);
      const data = handleResponse(response);
      console.log(data);
      if (!data || !Array.isArray(data)) {
        console.error('Invalid attendance data:', data);
        return [];
      }
      const attendances = data.map(attendance => ({
        id: attendance.id,
        employee_id: attendance.staff_id,
        date: attendance.date,
        time_start: attendance.time_start,
        time_end: attendance.time_end,
        status: attendance.status,
        reason: attendance.reason
      }));
      
      return attendances;
    } catch (error) {
      console.error('Error fetching attendances:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      const employeesData = await fetchEmployees();
      setEmployees(employeesData);

      const schedulesData = await fetchSchedules();
      
      // Set previous schedules - lọc lịch trước thứ 2 của tuần hiện tại
      const prevSchedules = schedulesData.filter(schedule => {
        const scheduleDate = moment(schedule.date);
        return scheduleDate.isBefore(currentWeek.clone().startOf('isoWeek'));
      });
      setPreviousSchedules(prevSchedules);

      // Set current week schedules - lọc lịch từ thứ 2 đến chủ nhật
      const filteredSchedules = schedulesData.filter(schedule => {
        const scheduleDate = moment(schedule.date);
        return scheduleDate.isBetween(
          currentWeek.clone().startOf('isoWeek'), 
          currentWeek.clone().endOf('isoWeek'), 
          'day', 
          '[]'
        );
      });
      setSchedules(filteredSchedules);

      const attendancesData = await fetchAttendances();
      console.log(attendancesData);
      const filteredAttendances = attendancesData.filter(attendance => {
        const attendanceDate = moment(attendance.date);
        return attendanceDate.isBetween(
          currentWeek.clone().startOf('isoWeek'), 
          currentWeek.clone().endOf('isoWeek'), 
          'day', 
          '[]'
        );
      });
      setAttendances(filteredAttendances);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentWeek, selectedMonth]);

  const changeWeek = (newWeek) => {
    setCurrentWeek(newWeek);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', height: '800px' }}>
          <Space align="center" style={{ marginBottom: 16 }}>
            <Title level={2}>Quản lý Nhân viên</Title>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: 120 }}
            >
              {[...Array(12)].map((_, i) => (
                <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
              ))}
            </Select>
          </Space>
          <Tabs defaultActiveKey="1" type="card" size="large">
            <TabPane tab="Lịch làm việc" key="1">
              <ScheduleTab 
                employees={employees}
                schedules={schedules}
                setSchedules={setSchedules}
                currentWeek={currentWeek}
                onChangeWeek={changeWeek}
                loadData={loadData}
                previousSchedules={previousSchedules}
                fetchSchedules={fetchSchedules}
              />
            </TabPane>
            <TabPane tab="Chấm Công" key="2">
              <AttendanceTab 
                employees={employees}
                attendances={attendances}
                setAttendances={setAttendances}
                currentWeek={currentWeek}
                onChangeWeek={changeWeek}
                loadData={loadData}
              />
            </TabPane>
            <TabPane tab="Thông tin nhân viên" key="4">
              <InfoEmployee employees={employees} setEmployees={setEmployees} />
            </TabPane>
          </Tabs>
        </Space>
      </Content>
    </Layout>
  );
};

export default StaffAdmin;
