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

export const fetchSchedules = () => {
  // TODO: Replace with actual API call
    return Promise.resolve([
        { id: 1, employeeId: 1, date: '2023-04-20', startTime: '09:00', endTime: '17:00' },
        { id: 2, employeeId: 2, date: '2023-04-21', startTime: '10:00', endTime: '18:00' },
        // ... more schedules
    ]);
};

export const fetchSalaries = async () => {

    const response = await EmployeeService.getAllSalary();
    const cleanData = handleResponse(response);

    const data = JSON.parse(cleanData);

    const salaries = data.map(salary => ({
        id: salary.id,
        employee_id: salary.staff_id,
        mouth: salary.mouth,
        bassic_wage: salary.bassic_wage,
        total: salary.total,
        work_day: salary.work_day,
        salary_overtime: salary.salary_overtime,
        overtime: salary.overtime,
    }));

    return salaries;
  // TODO: Replace with actual API call
    
};
