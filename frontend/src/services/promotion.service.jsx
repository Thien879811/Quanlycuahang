import createApiClient from "./api.service";
class PromotionService {
    constructor(baseUrl = "/api/promotion") {
        this.api = createApiClient(baseUrl);
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async getPromotion() {
        return (await this.api.get("/")).data;
    }
}
export default new PromotionService();  