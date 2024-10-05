
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
    async getCurrentUser(token   ) {
        return (await this.api.get("/current-user",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data;
    }
    async getAllUser() {
        return (await this.api.get("/users")).data;
    }
    async deleteUser(id) {
        return (await this.api.delete(`/users/${id}`)).data;
    }
    async createUser(data) {
        return (await this.api.post("/users", data)).data;
    }
    async updateUser(id, data) {
        return (await this.api.put(`/users/${id}`, data)).data;
    }
}
export default new AuthService();
