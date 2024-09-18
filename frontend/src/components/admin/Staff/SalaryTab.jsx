import React from 'react';
import { Table } from 'antd';

const SalaryTab = ({ employees, salaries }) => {
    const salaryColumns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Lương cơ bản',
            dataIndex: 'baseSalary',
            key: 'baseSalary',
        },
        {
            title: 'Làm thêm giờ',
            dataIndex: 'overtime',
            key: 'overtime',
        },
        {
            title: 'Khấu trừ',
            dataIndex: 'deductions',
            key: 'deductions',
        },
        {
            title: 'Tổng lương',
            dataIndex: 'totalSalary',
            key: 'totalSalary',
        },
    ];

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
        console.log('Đang lưu lịch trình:', record);
        message.success('Lịch trình đã được lưu thành công');
    };

    return (
        <Table
        columns={salaryColumns}
        dataSource={salaries.map(s => ({
            ...s,
            name: employees.find(e => e.id === s.employeeId)?.name
        }))}
        rowKey="id"
        />
    );
};

export default SalaryTab;
