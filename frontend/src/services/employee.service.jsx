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
        return (await this.api.put(`/${id}`, data)).data;
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
}
export default new EmployeeService();