// app/services/theodoimuonsach.service.js
const { ObjectId } = require("mongodb");

class TheoDoiMuonSachService {
  constructor(client) {
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
  }

  extractTheoDoiMuonSachData(payload = {}) {
    const theodoi = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra,
    };
    Object.keys(theodoi).forEach((k) => theodoi[k] === undefined && delete theodoi[k]);
    return theodoi;
  }

  async create(payload) {
    const theodoi = this.extractTheoDoiMuonSachData(payload);
    
    // Tự động set NgayMuon là ngày hiện tại nếu không có
    if (!theodoi.NgayMuon) {
      theodoi.NgayMuon = new Date();
    } else {
      // Đảm bảo NgayMuon là Date object
      theodoi.NgayMuon = new Date(theodoi.NgayMuon);
    }
    
    // Tự động tính NgayTra = NgayMuon + 14 ngày (luôn ghi đè)
    const ngayTraDuKien = new Date(theodoi.NgayMuon);
    ngayTraDuKien.setDate(ngayTraDuKien.getDate() + 14);
    theodoi.NgayTraDuKien = ngayTraDuKien;
    
    // NgayTra thực tế để null (chưa trả)
    theodoi.NgayTra = null;
    
    const result = await this.TheoDoiMuonSach.insertOne(theodoi);
    return { _id: result.insertedId, ...theodoi };
  }

  async find(filter = {}) {
    const cursor = await this.TheoDoiMuonSach.find(filter);
    return await cursor.toArray();
  }

  async findByDocGia(maDocGia) {
    return await this.find({ MaDocGia: maDocGia });
  }

  async findBySach(maSach) {
    return await this.find({ MaSach: maSach });
  }

  async findById(id) {
    return await this.TheoDoiMuonSach.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const update = this.extractTheoDoiMuonSachData(payload);
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.TheoDoiMuonSach.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.TheoDoiMuonSach.deleteMany({});
    return result.deletedCount;
  }

  // Tìm sách chưa trả (NgayTra = null hoặc không có)
  async findChuaTra(maDocGia = null) {
    const filter = { $or: [{ NgayTra: null }, { NgayTra: { $exists: false } }] };
    if (maDocGia) {
      filter.MaDocGia = maDocGia;
    }
    return await this.find(filter);
  }
  
  // Cập nhật NgayTra khi trả sách
  async traSach(id) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: { NgayTra: new Date() } },
      { returnDocument: "after" }
    );
    return result.value;
  }
}

module.exports = TheoDoiMuonSachService;
