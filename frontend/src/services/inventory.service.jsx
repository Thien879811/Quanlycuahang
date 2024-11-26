import createApiClient from "./api.service";
class CheckInventoryService {
    constructor(baseUrl = "/api/check-inventory") {
        this.api = createApiClient(baseUrl);
    }
    async getAll(timeRange = null) {
        return (await this.api.get(`/${timeRange}`)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async accept(id) {
        return (await this.api.put(`/accept/${id}`)).data;
    }
}
export default new CheckInventoryService();