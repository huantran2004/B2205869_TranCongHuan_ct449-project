// app/services/nhaxuatban.service.js
const { ObjectId } = require("mongodb");

class NhaXuatBanService {
  constructor(client) {
    this.NhaXuatBan = client.db().collection("nhaxuatban");
  }

  extractNhaXuatBanData(payload = {}) {
    const nxb = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };
    Object.keys(nxb).forEach((k) => nxb[k] === undefined && delete nxb[k]);
    return nxb;
  }

  // Auto-generate MaNXB (NXB001, NXB002, NXB003...)
  async generateMaNXB() {
    const lastNXB = await this.NhaXuatBan.find()
      .sort({ MaNXB: -1 })
      .limit(1)
      .toArray();
    
    if (lastNXB.length === 0) return "NXB001";
    
    const lastMa = lastNXB[0].MaNXB;
    const number = parseInt(lastMa.substring(3)) + 1; // Lấy số sau "NXB"
    return "NXB" + number.toString().padStart(3, "0"); // NXB001, NXB002, ...
  }

  async create(payload) {
    const nxb = this.extractNhaXuatBanData(payload);
    
    // Auto-generate MaNXB nếu không có
    if (!nxb.MaNXB) {
      nxb.MaNXB = await this.generateMaNXB();
    }
    
    // Insert document mới
    await this.NhaXuatBan.insertOne(nxb);
    
    // Trả về document vừa tạo
    return nxb;
  }

  async find(filter = {}) {
    const cursor = await this.NhaXuatBan.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      TenNXB: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.NhaXuatBan.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByMaNXB(maNXB) {
    return await this.NhaXuatBan.findOne({ MaNXB: maNXB });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const currentNXB = await this.NhaXuatBan.findOne(filter);
    
    if (!currentNXB) {
      throw new Error("Không tìm thấy nhà xuất bản");
    }
    
    const update = this.extractNhaXuatBanData(payload);
    const result = await this.NhaXuatBan.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    
    // Trả về document đã update hoặc currentNXB nếu không có result
    return result.value || result || currentNXB;
  }

  async delete(id) {
    const result = await this.NhaXuatBan.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.NhaXuatBan.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = NhaXuatBanService;
