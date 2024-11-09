import createApiClient from "./api.service";
class OrderService {
    constructor(baseUrl = "/api/orders") {
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
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async getDetail(id) {
        return (await this.api.get(`/detail/${id}`)).data;
    }
    async getSalesOverview(type) {
        return (await this.api.get(`/sales-overview/${type}`)).data;
    }
    async getOrder(type,customDate) {
        return (await this.api.post(`/${type}`,{date:customDate})).data;
    }
    async updateVoucher(id, data) {
        return (await this.api.put(`/voucher/${id}`, data)).data;
    }
    async cancelOrder(id) {
        return (await this.api.put(`/cancel/${id}`)).data;
    }
}
export default new OrderService();


