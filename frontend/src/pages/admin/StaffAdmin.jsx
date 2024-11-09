import React, { useState, useEffect } from 'react';
import { Tabs, Layout, Typography, Space } from 'antd';
import ScheduleTab from '../../components/admin/Staff/ScheduleTab';
import SalaryTab from '../../components/admin/Staff/SalaryTab';
import InfoEmployee from '../../components/admin/Staff/InfoEmployee';
import AttendanceTab from '../../components/admin/Staff/AttendanceTab';
import { fetchEmployees, fetchSchedules, fetchSalaries, fetchAttendances } from './api/index';

const { TabPane } = Tabs;
const { Content } = Layout;
const { Title } = Typography;

const EmployeeSchedule = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    const loadData = async () => {
      const employeesData = await fetchEmployees();
      setEmployees(employeesData);

      const schedulesData = await fetchSchedules();
      const filteredSchedules = schedulesData.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        const startDate = new Date(currentWeek.start);
        const endDate = new Date(currentWeek.end);
        return scheduleDate >= startDate && scheduleDate <= endDate;
      });
      setSchedules(filteredSchedules);

      const salariesData = await fetchSalaries();
      setSalaries(salariesData);

      const attendancesData = await fetchAttendances();
      const filteredAttendances = attendancesData.filter(attendance => {
        const attendanceDate = new Date(attendance.date);
        const startDate = new Date(currentWeek.start);
        const endDate = new Date(currentWeek.end);
        return attendanceDate >= startDate && attendanceDate <= endDate;
      });
      setAttendances(filteredAttendances);
    };

    loadData();
  }, [currentWeek]);

  const changeWeek = (direction) => {
    setCurrentWeek(prev => {
      const startDate = new Date(prev.start);
      const endDate = new Date(prev.end);
      const days = direction === 'next' ? 7 : -7;
      
      startDate.setDate(startDate.getDate() + days);
      endDate.setDate(endDate.getDate() + days);
      
      return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      };
    });
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
                salaries={salaries}
                attendances={attendances}
                currentWeek={currentWeek}
                onChangeWeek={changeWeek}
              />
            </TabPane>
            <TabPane tab="Lương" key="3">
              <SalaryTab 
                employees={employees}
                salaries={salaries}
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

export default EmployeeSchedule;
