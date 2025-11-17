// app/services/nhanvien.service.js
const { ObjectId } = require("mongodb");

class NhanVienService {
  constructor(client) {
    this.NhanVien = client.db().collection("nhanvien");
  }

  extractNhanVienData(payload = {}) {
    const nhanvien = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      ChucVu: payload.ChucVu,
      DiaChi: payload.DiaChi,
      SoDienThoai: payload.SoDienThoai,
    };
    Object.keys(nhanvien).forEach((k) => nhanvien[k] === undefined && delete nhanvien[k]);
    return nhanvien;
  }

  // Auto-generate MSNV (NV001, NV002, NV003...)
  async generateMSNV() {
    const lastNhanVien = await this.NhanVien.find()
      .sort({ MSNV: -1 })
      .limit(1)
      .toArray();
    
    if (lastNhanVien.length === 0) return "NV001";
    
    const lastMa = lastNhanVien[0].MSNV;
    const number = parseInt(lastMa.substring(2)) + 1; // Lấy số sau "NV"
    return "NV" + number.toString().padStart(3, "0"); // NV001, NV002, ...
  }

  async create(payload) {
    const nhanvien = this.extractNhanVienData(payload);
    
    // Auto-generate MSNV nếu không có
    if (!nhanvien.MSNV) {
      nhanvien.MSNV = await this.generateMSNV();
    }
    
    // Insert document mới
    await this.NhanVien.insertOne(nhanvien);
    
    // Trả về document vừa tạo
    return nhanvien;
  }

  async find(filter = {}) {
    const cursor = await this.NhanVien.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      HoTenNV: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.NhanVien.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByMSNV(msnv) {
    return await this.NhanVien.findOne({ MSNV: msnv });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractNhanVienData(payload);
    
    // Không xóa password nếu không được cung cấp
    if (!payload.Password) {
      delete update.Password;
    }
    
    const result = await this.NhanVien.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.NhanVien.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.NhanVien.deleteMany({});
    return result.deletedCount;
  }

  // Login
  async login(msnv, password) {
    return await this.NhanVien.findOne({ MSNV: msnv, Password: password });
  }
}

module.exports = NhanVienService;
