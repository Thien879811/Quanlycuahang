import EmployeeService from "../../../services/employee.service"

export const handleResponse = (response) => {
    if (typeof response !== 'string') {
        console.error('Invalid response type:', typeof response);
        return null;
    }
    const cleanJsonString = response.replace(/^[^[{]*([\[{])/,'$1').replace(/([\]}])[^}\]]*$/,'$1');
    try {
        const parsed = JSON.parse(cleanJsonString);
        // Ensure we always return an array
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}

export const fetchEmployees = async () => {
    try {
        const response = await EmployeeService.getAll();
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

export const fetchSchedules = async () => {
    try {
        const response = await EmployeeService.getWorkingScheduleAll();
        const data = handleResponse(response);
        return data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const fetchSalaries = async () => {
    try {
        const response = await EmployeeService.getAllSalary();
        const data = handleResponse(response);
        if (!data) {
            throw new Error('Invalid response data');
        }

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
    } catch (error) {
        console.error('Error fetching salaries:', error);
        throw error;
    }
};

export const fetchAttendances = async () => {
    try {
        const response = await EmployeeService.getAttendance();
    
        const data = handleResponse(response);
        if (!data || !Array.isArray(data)) {
            console.error('Invalid attendance data:', data);
            return [];
        }
        console.log(data);

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
