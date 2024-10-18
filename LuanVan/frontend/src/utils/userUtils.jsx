import { useState, useEffect } from 'react';
import employeeService from '../services/employee.service.jsx';
import { handleResponse } from '../functions/index';

const useEmployee = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmployeeInfo = async (userId) => {
        setLoading(true);
        setError(null);
        try {
        const response = await employeeService.get(userId);

        const data = handleResponse(response);
        console.log(data);
        localStorage.setItem('employee', JSON.stringify(data));
        setEmployee(response.data);
        
        } catch (err) {
            setError('Failed to fetch employee information');
            console.error('Error fetching employee info:', err);
        } finally {
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchEmployeeData = () => {
            if (user && user.id) {
                fetchEmployeeInfo(user.id);
            }
        };
        // Automatically run when the web loads
        fetchEmployeeData();

    }, [user]);

  return { employee, loading, error, fetchEmployeeInfo };
};

export default useEmployee;
