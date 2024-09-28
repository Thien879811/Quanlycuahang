import EmployeeService from "../../../services/employee.service"

export const handleResponse = (response) => {
    // Loại bỏ tất cả các ký tự không phải JSON từ đầu và cuối chuỗi
    const cleanJsonString = response.replace(/^[^[{]*([\[{])/,'$1').replace(/([\]}])[^}\]]*$/,'$1'); // Để debug
    return cleanJsonString;
}

export const fetchEmployees = async () => {
    try {
        const response = await EmployeeService.getAll();
        const cleanData = handleResponse(response);
        let data;
        try {
            data = JSON.parse(cleanData);
        } catch (parseError) {
            console.error('Error parsing JSON:', cleanData);
            throw new Error('Invalid JSON response');
        }

        // Chuyển đổi dữ liệu nhận được thành định dạng mong muốn
        const employees = data.map(employee => ({
            id: employee.id,
            name: employee.names,
            age: employee.age,
            address: employee.address,
            phone: employee.phone,
            position_id: employee.position_id,
            user_id: employee.user_id,
            created_at: employee.created_at,
            updated_at: employee.updated_at
        }));

        return employees;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
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
