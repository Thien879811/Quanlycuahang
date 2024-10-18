import createApiClient from "./api.service";
class ExpiryDateService {
    constructor(baseUrl = "/api") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/hang-su-dung-product")).data;
    }
    async create(data) {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return (await this.api.post("/", data, { headers })).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return (await this.api.put(`/${id}`, data, { headers })).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ExpiryDateService() ;
