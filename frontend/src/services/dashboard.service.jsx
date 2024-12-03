import createApiClient from "./api.service";
class DashboardService {
    constructor(baseUrl = "/api/dashboard") {
        this.api = createApiClient(baseUrl);
    }
    async getProductSummary() {
        return (await this.api.get(`/product-summary`)).data;
    }   

    async getOrderSummary() {
        return (await this.api.get(`/order-summary`)).data;
    }

    async getSalesAndPurchaseChartData() {
        return (await this.api.get(`/sales-and-purchase-chart-data/`)).data;
    }

    async getTopSellingStock(type, timeParam=null) {
        return (await this.api.get(`/top-selling-stock/${type}`, {params: {date: timeParam}})).data;
    }

    async getLowQuantityStock() {
        return (await this.api.get(`/low-quantity-stock`)).data;
    }

    async getPurchaseData(type, timeParam=null) {
        return (await this.api.get(`/purchase-data/${type}`, {params: {date: timeParam}})).data;
    }
    async getSalesOverview(type, timeParam=null) {
        return (await this.api.get(`/sales-overview/${type}`, {params: {date: timeParam}})).data;
    }

    async getInventorySummary(type, timeParam=null) {
        return (await this.api.get(`/inventory-summary/${type}`, {params: {date: timeParam}})).data;
    }
}
export default new DashboardService();