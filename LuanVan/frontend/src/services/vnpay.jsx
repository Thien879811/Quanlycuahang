import createApiClient from "./api.service";

class VnpayService {
    constructor(baseUrl = "/api/vnpay") {
        this.api = createApiClient(baseUrl);
    }

    async vnpay(data) {
        return (await this.api.post(`/pay`, data)).data;
    }
}
export default new VnpayService();  