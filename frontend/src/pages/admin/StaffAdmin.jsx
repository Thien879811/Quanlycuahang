
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import ScheduleTab from '../../components/admin/Staff/ScheduleTab';
import SalaryTab from '../../components/admin/Staff/SalaryTab';
import InfoEmployee from '../../components/admin/Staff/InfoEmployee';
import { fetchEmployees, fetchSchedules, fetchSalaries } from './api/index';

const { TabPane } = Tabs;

const EmployeeSchedule = () => {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    fetchEmployees().then(setEmployees);
    fetchSchedules().then(setSchedules);
    fetchSalaries().then(setSalaries);
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
        <TabPane tab="Lương" key="2">
          <SalaryTab 
            employees={employees}
            salaries={salaries}
          />
        </TabPane>
        <TabPane tab="Thông tin nhân viên" key="3">
          <InfoEmployee employees={employees} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmployeeSchedule;
