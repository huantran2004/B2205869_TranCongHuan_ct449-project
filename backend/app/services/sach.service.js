// app/services/sach.service.js
const { ObjectId } = require("mongodb");

class SachService {
  constructor(client) {
    this.Sach = client.db().collection("sach");
    this.NhaXuatBan = client.db().collection("nhaxuatban");
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

  async validateSach(sach, isUpdate = false, currentMaSach = null) {
    const errors = [];
    
    // Validate Mã sách
    if (!sach.MaSach) {
      errors.push("Mã sách là bắt buộc");
    } else {
      // Kiểm tra trùng Mã sách (chỉ khi tạo mới hoặc đổi mã)
      if (!isUpdate || (currentMaSach && currentMaSach !== sach.MaSach)) {
        const existing = await this.Sach.findOne({ MaSach: sach.MaSach });
        if (existing) {
          errors.push(`Mã sách "${sach.MaSach}" đã tồn tại`);
        }
      }
    }
    
    // Validate Mã NXB
    if (!sach.MaNXB) {
      errors.push("Mã nhà xuất bản là bắt buộc");
    } else {
      const nxb = await this.NhaXuatBan.findOne({ MaNXB: sach.MaNXB });
      if (!nxb) {
        errors.push(`Mã nhà xuất bản "${sach.MaNXB}" không tồn tại`);
      }
    }
    
    // Validate các trường khác
    if (!sach.TenSach) {
      errors.push("Tên sách là bắt buộc");
    }
    
    if (sach.DonGia !== undefined && sach.DonGia < 0) {
      errors.push("Đơn giá phải lớn hơn hoặc bằng 0");
    }
    
    if (sach.SoQuyen !== undefined && sach.SoQuyen < 0) {
      errors.push("Số quyển phải lớn hơn hoặc bằng 0");
    }
    
    return errors;
  }

  async create(payload) {
    const sach = this.extractSachData(payload);
    
    // Validate
    const errors = await this.validateSach(sach, false);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
    
    const result = await this.Sach.insertOne(sach);
    return await this.Sach.findOne({ _id: result.insertedId });
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
    const currentSach = await this.Sach.findOne(filter);
    
    if (!currentSach) {
      throw new Error("Không tìm thấy sách");
    }
    
    const update = this.extractSachData(payload);
    
    // Validate (cho phép giữ nguyên MaSach)
    const errors = await this.validateSach(update, true, currentSach.MaSach);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
    
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
