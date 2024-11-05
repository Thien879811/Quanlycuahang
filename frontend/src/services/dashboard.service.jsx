import createApiClient from "./api.service";
class DashboardService {
    constructor(baseUrl = "/api/dashboard") {
        this.api = createApiClient(baseUrl);
    }
    async getSalesOverview(type) {
        return (await this.api.get(`/sales-overview/${type}`)).data;
    }
}
export default new DashboardService();