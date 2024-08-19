
import createApiClient from "./api.service";
class AuthService {
    constructor(baseUrl = "/api") {
        this.api = createApiClient(baseUrl);
    }
    async login(data) {
        return (await this.api.post("/login",data)).data;
    }
    async register(data) {
        return (await this.api.post("/register", data)).data;
    }
    async logout() {
        return (await this.api.get("/logout")).data;
    }
}
export default new AuthService();
