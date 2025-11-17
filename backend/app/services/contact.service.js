// app/services/docgia.service.js
const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgia");
  }

  extractDocGiaData(payload = {}) {
    const docgia = {
      MaDocGia: payload.MaDocGia,
      HoLot: payload.HoLot,
      Ten: payload.Ten,
      NgaySinh: payload.NgaySinh,
      Phai: payload.Phai,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
      Password: payload.Password,
    };
    Object.keys(docgia).forEach((k) => docgia[k] === undefined && delete docgia[k]);
    return docgia;
  }

  async generateMaDocGia() {
    // Tìm MaDocGia lớn nhất hiện tại
    const lastDocGia = await this.DocGia.find()
      .sort({ MaDocGia: -1 })
      .limit(1)
      .toArray();
    
    if (lastDocGia.length === 0) {
      return "DG001"; // Mã độc giả đầu tiên
    }
    
    const lastMa = lastDocGia[0].MaDocGia;
    const number = parseInt(lastMa.substring(2)) + 1; // Lấy số sau "DG"
    return "DG" + number.toString().padStart(3, "0"); // DG001, DG002, ...
  }

  async create(payload) {
    const docgia = this.extractDocGiaData(payload);
    
    // Auto-generate MaDocGia nếu không có
    if (!docgia.MaDocGia) {
      docgia.MaDocGia = await this.generateMaDocGia();
    }
    
    // Insert document mới
    await this.DocGia.insertOne(docgia);
    
    // Trả về document vừa tạo
    return docgia;
  }

  async find(filter = {}) {
    const cursor = await this.DocGia.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      $or: [
        { HoLot: { $regex: new RegExp(name), $options: "i" } },
        { Ten: { $regex: new RegExp(name), $options: "i" } },
      ],
    });
  }

  async findById(id) {
    return await this.DocGia.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async findByMaDocGia(maDocGia) {
    return await this.DocGia.findOne({ MaDocGia: maDocGia });
  }

  async update(id, payload) {
    const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
    const currentDocGia = await this.DocGia.findOne(filter);
    
    if (!currentDocGia) {
      throw new Error("Không tìm thấy độc giả");
    }
    
    const update = this.extractDocGiaData(payload);
    
    // Không update Password nếu không được gửi lên (giữ nguyên password cũ)
    if (!payload.Password) {
      delete update.Password;
    }
    
    const result = await this.DocGia.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    
    // Trả về document đã update hoặc currentDocGia nếu không có result
    return result.value || result || currentDocGia;
  }

  async delete(id) {
    const result = await this.DocGia.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.DocGia.deleteMany({});
    return result.deletedCount;
  }

  // Login for DocGia
  async login(maDocGia, password) {
    return await this.DocGia.findOne({ MaDocGia: maDocGia, Password: password });
  }

  async findByMaDocGia(maDocGia) {
    return await this.DocGia.findOne({ MaDocGia: maDocGia });
  }
}

module.exports = DocGiaService;
