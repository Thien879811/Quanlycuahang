import createApiClient from "./api.service";
class PromotionService {
    constructor(baseUrl = "/api/promotions") {
        this.api = createApiClient(baseUrl);
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
}
export default new PromotionService();  