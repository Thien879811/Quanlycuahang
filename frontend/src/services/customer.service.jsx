import createApiClient from "./api.service";
class CustomerService {
    constructor(baseUrl = "/api/customer") {
        this.api = createApiClient(baseUrl);
    }
    async getAll(params) {
        return (await this.api.get("/", { params })).data;
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
    async getInfoBuy(id) {
        return (await this.api.get(`/${id}/info-buy`)).data;
    }
    async getHistoryRedeemPoint(id) {
        return (await this.api.get(`/${id}/history-redeem-point`)).data;
    }
}
export default new CustomerService();
