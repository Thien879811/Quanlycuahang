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
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    //hủy đơn hàng
    async cancel(id, note) {
        return (await this.api.post(`/cancel/${id}`, {note: note})).data;
    }
    //chấp nhận hủy đơn hàng
    async acceptCancel(id) {
        return (await this.api.put(`/accept-cancel/${id}`)).data;
    }
    //yêu cầu hủy đơn hàng
    async cancelRequest(id) {
        return (await this.api.put(`/cancel-request/${id}`)).data;
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


    async get() {
        return (await this.api.get(`/order-products`)).data;
    }
    async updateOrderProducts(id, data) {
        return (await this.api.post(`/order-products/${id}`, data)).data;
    }
    
    async deleteOrderProducts(order_id,product_id) {
        return (await this.api.delete(`/products/${order_id}/${product_id}`)).data;
    }

    async addDiscount(id, data) {
        return (await this.api.post(`/add-discount/${id}`, data)).data;
    }

}
export default new OrderService();


