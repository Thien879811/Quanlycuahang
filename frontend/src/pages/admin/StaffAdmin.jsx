import React, { useState, useEffect } from 'react';
import { Tabs, Layout, Typography, Space } from 'antd';
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

const StaffAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));

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
      const response = await employeeService.getAttendance(11);
      const data = handleResponse(response);
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
      const filteredSchedules = schedulesData.filter(schedule => {
        const scheduleDate = moment(schedule.date);
        return scheduleDate.isBetween(
          currentWeek.clone().startOf('week'), 
          currentWeek.clone().endOf('week'), 
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
          currentWeek.clone().startOf('week'), 
          currentWeek.clone().endOf('week'), 
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
  }, [currentWeek]);

  const changeWeek = (newWeek) => {
    setCurrentWeek(newWeek);
  };

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', height: '800px' }}>
          <Title level={2}>Quản lý Nhân viên</Title>
          <Tabs defaultActiveKey="1" type="card" size="large">
            <TabPane tab="Lịch làm việc" key="1">
              <ScheduleTab 
                employees={employees}
                schedules={schedules}
                setSchedules={setSchedules}
                currentWeek={currentWeek}
                onChangeWeek={changeWeek}
                loadData={loadData}
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
              <InfoEmployee employees={employees} />
            </TabPane>
          </Tabs>
        </Space>
      </Content>
    </Layout>
  );
};

export default StaffAdmin;
