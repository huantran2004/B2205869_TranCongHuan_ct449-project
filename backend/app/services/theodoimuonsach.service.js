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
      // Thêm field TrangThai để quản lý workflow (không làm mất 4 field gốc)
      TrangThai: payload.TrangThai,
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
      theodoi.NgayMuon = new Date(theodoi.NgayMuon);
    }
    
    // NgayTra = NgayMuon + 14 ngày (Ngày trả DỰ KIẾN theo quy định)
    // Khi trả sách thực tế, sẽ update lại NgayTra thành ngày trả thực tế
    const ngayTraDuKien = new Date(theodoi.NgayMuon);
    ngayTraDuKien.setDate(ngayTraDuKien.getDate() + 14);
    theodoi.NgayTra = ngayTraDuKien;
    
    // Trạng thái ban đầu là "Chờ duyệt"
    theodoi.TrangThai = "Chờ duyệt";
    
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
    const currentRecord = await this.TheoDoiMuonSach.findOne(filter);
    
    if (!currentRecord) {
      throw new Error("Không tìm thấy bản ghi theo dõi mượn sách");
    }
    
    const update = this.extractTheoDoiMuonSachData(payload);
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    
    // Trả về document đã update hoặc currentRecord nếu không có result
    return result.value || result || currentRecord;
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

  // Tìm sách chưa trả (TrangThai != "Đã trả")
  async findChuaTra(maDocGia = null) {
    const filter = { TrangThai: { $ne: "Đã trả" } };
    if (maDocGia) {
      filter.MaDocGia = maDocGia;
    }
    return await this.find(filter);
  }
  
  // Duyệt yêu cầu mượn sách (Admin)
  async duyetMuonSach(id) {
    console.log('duyetMuonSach - ID nhận được:', id);
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    console.log('duyetMuonSach - Filter:', filter);
    
    const currentRecord = await this.TheoDoiMuonSach.findOne(filter);
    console.log('duyetMuonSach - Current record:', currentRecord);
    
    if (!currentRecord) {
      throw new Error("Không tìm thấy bản ghi theo dõi mượn sách");
    }
    
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { $set: { TrangThai: "Đã duyệt" } },
      { returnDocument: "after" }
    );
    console.log('duyetMuonSach - Result:', result);
    return result.value || result || currentRecord;
  }
  
  // Cập nhật NgayTra khi trả sách (Admin)
  async traSach(id) {
    console.log('traSach - ID nhận được:', id);
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    console.log('traSach - Filter:', filter);
    
    const currentRecord = await this.TheoDoiMuonSach.findOne(filter);
    console.log('traSach - Current record:', currentRecord);
    
    if (!currentRecord) {
      throw new Error("Không tìm thấy bản ghi theo dõi mượn sách");
    }
    
    const result = await this.TheoDoiMuonSach.findOneAndUpdate(
      filter,
      { 
        $set: { 
          NgayTra: new Date(),  // Cập nhật ngày trả THỰC TẾ
          TrangThai: "Đã trả" 
        } 
      },
      { returnDocument: "after" }
    );
    console.log('traSach - Result:', result);
    return result.value || result || currentRecord;
  }
}

module.exports = TheoDoiMuonSachService;
