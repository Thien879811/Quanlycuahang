import React, { useState, useEffect } from 'react';
import { Tabs, Layout, Typography, Space } from 'antd';
import ScheduleTab from '../../components/admin/Staff/ScheduleTab';
import SalaryTab from '../../components/admin/Staff/SalaryTab';
import InfoEmployee from '../../components/admin/Staff/InfoEmployee';
import AttendanceTab from '../../components/admin/Staff/AttendanceTab';
import { fetchEmployees, fetchSchedules, fetchSalaries, fetchAttendances } from './api/index';
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

      const salariesData = await fetchSalaries();
      setSalaries(salariesData);

      const attendancesData = await fetchAttendances();
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
              />
            </TabPane>
            <TabPane tab="Chấm Công" key="2">
              <AttendanceTab 
                employees={employees}
                attendances={attendances}
                setAttendances={setAttendances}
                currentWeek={currentWeek}
                onChangeWeek={changeWeek}
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
