// app/services/sach.service.js
const { ObjectId } = require("mongodb");

class SachService {
  constructor(client) {
    this.Sach = client.db().collection("sach");
  }

  extractSachData(payload = {}) {
    const sach = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: payload.MaNXB,
      NguonGoc: payload.NguonGoc,
      TacGia: payload.TacGia,
    };
    Object.keys(sach).forEach((k) => sach[k] === undefined && delete sach[k]);
    return sach;
  }

  async create(payload) {
    const sach = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      { MaSach: sach.MaSach },
      { $set: sach },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async find(filter = {}) {
    const cursor = await this.Sach.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      TenSach: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.Sach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByMaSach(maSach) {
    return await this.Sach.findOne({ MaSach: maSach });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractSachData(payload);
    const result = await this.Sach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.Sach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Sach.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = SachService;
