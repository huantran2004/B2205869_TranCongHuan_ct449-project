import createApiClient from "./api.service";

class NhanVienService {
  constructor(baseUrl = "/api/nhanvien") {
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

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async login(msnv, password) {
    return (await this.api.post("/login", { MSNV: msnv, Password: password })).data;
  }
}

export default new NhanVienService();
