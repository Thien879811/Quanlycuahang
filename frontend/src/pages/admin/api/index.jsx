export const fetchEmployees = () => {
  // TODO: Replace with actual API call

    const response = await fetch('http://localhost:8000/api/employees/');
    const data = await response.json();
    return Promise.resolve([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        // ... more employees
    ]);
};

export const fetchSchedules = () => {
  // TODO: Replace with actual API call
    return Promise.resolve([
        { id: 1, employeeId: 1, date: '2023-04-20', startTime: '09:00', endTime: '17:00' },
        { id: 2, employeeId: 2, date: '2023-04-21', startTime: '10:00', endTime: '18:00' },
        // ... more schedules
    ]);
};

export const fetchSalaries = () => {
  // TODO: Replace with actual API call
    return Promise.resolve([
        { id: 1, employeeId: 1, month: '2023-04', baseSalary: 5000, overtime: 500, deductions: 200, totalSalary: 5300 },
        { id: 2, employeeId: 2, month: '2023-04', baseSalary: 4500, overtime: 300, deductions: 100, totalSalary: 4700 },
        // ... more salary data
    ]);
};
