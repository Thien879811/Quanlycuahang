import createApiClient from "./api.service";
class EmployeeService {
    constructor(baseUrl = "/api/employee") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) { 
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(user_id) {
        return (await this.api.get(`/${user_id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/edit/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async createWorkingSchedule(data) {
        return (await this.api.post("/create-working-schedule", data)).data;
    }
    async getWorkingSchedule(staff_id) {
        return (await this.api.get(`/lich-lam-viec/${staff_id}`)).data;
    }

    async getWorkingScheduleAll() {
        return (await this.api.get("/lich-lam-viec")).data;
    }

    async updateWorkingSchedule(id, data) {
        return (await this.api.put(`/lich-lam-viec/${id}`, data)).data;
    }
    
    async deleteWorkingSchedule(id) {
        return (await this.api.delete(`/lich-lam-viec/${id}`)).data;
    }
    async createSalary(data) {
        return (await this.api.post("/salary", data)).data;
    }

    async getAllSalary() {
        return (await this.api.get("/salary")).data;
    }

    async createAttendance(data) {
        return (await this.api.post("/cham-cong/create", data)).data;
    }

    async getAllAttendance() {
        return (await this.api.get("/cham-cong")).data;
    }

    async updateAttendance(id, data) {
        return (await this.api.put(`/cham-cong/${id}`, data)).data;
    }
    //http://192.168.101.11:8000/api/employee/attendance/11
    async getAttendance(month = null) {
        return (await this.api.get(`/attendance/${month ? month : ''}`)).data;
    }
    async getPreviousWeek(staff_id, date) {
        return (await this.api.get(`/lich-lam-viec/${staff_id}/${date}`)).data;
    }
}
export default new EmployeeService();