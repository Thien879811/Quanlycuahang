import createApiClient from "./api.service";
class ReceiptService {
    constructor(baseUrl = "/api/goods-receipt") {
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
    async get(id) {
        return (await this.api.get(`/receipt/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async updateReceipt(id, data) {
        return (await this.api.put(`/update/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async returnReceipt(data) {
        return (await this.api.post('/return', data)).data;
    }

    async getReceipt(type, data) {
        return (await this.api.get(`/${type}`, {params: {date: data}})).data;
    }

    async getReceiptReturn(type, data) {
        return (await this.api.get(`/${type}/return`, {params: {date: data}})).data;
    }

    async createReceipt(data) {
        return (await this.api.post("/create", data)).data;
    }
    async chinhsua(id, data) {
        return (await this.api.put(`/chinhsua/${id}`, data)).data;
    }
}
export default new ReceiptService();
