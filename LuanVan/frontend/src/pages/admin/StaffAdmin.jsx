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

  useEffect(() => {
    fetchEmployees().then(setEmployees);
    fetchSchedules().then(setSchedules);
    fetchSalaries().then(setSalaries);
    fetchAttendances().then(setAttendances);
  }, []);

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
              />
            </TabPane>
            <TabPane tab="Chấm Công" key="2">
              <AttendanceTab 
                employees={employees}
                salaries={salaries}
                attendances={attendances}
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
