import createApiClient from "./api.service";

class DocGiaService {
  constructor(baseUrl = "/api/docgia") {
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

  async findByName(name) {
    return (await this.api.get("/", { params: { name } })).data;
  }

  async login(maDocGia, password) {
    return (await this.api.post("/login", { MaDocGia: maDocGia, Password: password })).data;
  }
}

export default new DocGiaService();
