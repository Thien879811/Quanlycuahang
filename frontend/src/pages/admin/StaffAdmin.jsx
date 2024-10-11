
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import ScheduleTab from '../../components/admin/Staff/ScheduleTab';
import SalaryTab from '../../components/admin/Staff/SalaryTab';
import InfoEmployee from '../../components/admin/Staff/InfoEmployee';
import AttendanceTab from '../../components/admin/Staff/AttendanceTab';
import { fetchEmployees, fetchSchedules, fetchSalaries, fetchAttendances } from './api/index';

const { TabPane } = Tabs;

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
    console.log(attendances);
  }, []);

  return (
    <div>
      <h1>Quản lý Nhân viên</h1>
      <Tabs defaultActiveKey="1">
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
    </div>
  );
};

export default EmployeeSchedule;
