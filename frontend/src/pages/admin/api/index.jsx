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


