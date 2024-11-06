import createApiClient from "./api.service";
class DashboardService {
    constructor(baseUrl = "/api/dashboard") {
        this.api = createApiClient(baseUrl);
    }

    async getSalesOverview(type) {
        return (await this.api.get(`/sales-overview/${type}`)).data;
    }

    async getInventorySummary(type) {
        return (await this.api.get(`/inventory-summary/${type}`)).data;
    }

    async getProductSummary() {
        return (await this.api.get(`/product-summary`)).data;
    }   

    async getOrderSummary() {
        return (await this.api.get(`/order-summary`)).data;
    }

    async getSalesAndPurchaseChartData() {
        return (await this.api.get(`/sales-and-purchase-chart-data`)).data;
    }

    async getTopSellingStock(type) {
        return (await this.api.get(`/top-selling-stock/${type}`)).data;
    }

    async getLowQuantityStock(type) {
        return (await this.api.get(`/low-quantity-stock/${type}`)).data;
    }

    async getPurchaseData(type) {
        return (await this.api.get(`/purchase-data/${type}`)).data;
    }
}
export default new DashboardService();