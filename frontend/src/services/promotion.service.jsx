import createApiClient from "./api.service";
class PromotionService {
    constructor(baseUrl = "/api/promotion") {
        this.api = createApiClient(baseUrl);
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async getPromotion(month = null) {
        if (month) {
            return (await this.api.get(`/product/${month}`)).data;
        }
        return (await this.api.get('/product')).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async updateQuantity(id) {
        return (await this.api.put(`/voucher/quantity/${id}`)).data;
    }
}
export default new PromotionService();  