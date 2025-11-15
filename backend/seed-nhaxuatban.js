const { MongoClient } = require("mongodb");

async function seedNhaXuatBan() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("quanlysach");
    const collection = db.collection("nhaxuatban");

    // Xóa dữ liệu cũ (nếu có)
    await collection.deleteMany({});
    console.log("Cleared old data");

    // Thêm dữ liệu mẫu nhà xuất bản
    const nhaXuatBans = [
      {
        MaNXB: "NXB001",
        TenNXB: "Nhà xuất bản Trẻ",
        DiaChi: "161B Lý Chính Thắng, Phường 7, Quận 3, TP.HCM"
      },
      {
        MaNXB: "NXB002",
        TenNXB: "Nhà xuất bản Kim Đồng",
        DiaChi: "55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội"
      },
      {
        MaNXB: "NXB003",
        TenNXB: "Nhà xuất bản Văn học",
        DiaChi: "18 Nguyễn Trường Tộ, Ba Đình, Hà Nội"
      },
      {
        MaNXB: "NXB004",
        TenNXB: "Nhà xuất bản Giáo dục Việt Nam",
        DiaChi: "81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội"
      },
      {
        MaNXB: "NXB005",
        TenNXB: "Nhà xuất bản Lao Động",
        DiaChi: "175 Giảng Võ, Đống Đa, Hà Nội"
      },
      {
        MaNXB: "NXB006",
        TenNXB: "Nhà xuất bản Tổng hợp TP.HCM",
        DiaChi: "62 Nguyễn Thị Minh Khai, Quận 1, TP.HCM"
      },
      {
        MaNXB: "NXB007",
        TenNXB: "Nhà xuất bản Thanh Niên",
        DiaChi: "64 Bà Triệu, Hoàn Kiếm, Hà Nội"
      },
      {
        MaNXB: "NXB008",
        TenNXB: "Nhà xuất bản Hội Nhà văn",
        DiaChi: "65 Nguyễn Du, Hai Bà Trưng, Hà Nội"
      }
    ];

    const result = await collection.insertMany(nhaXuatBans);
    console.log(`Inserted ${result.insertedCount} nhà xuất bản`);
    console.log("Danh sách nhà xuất bản:");
    nhaXuatBans.forEach(nxb => {
      console.log(`  - ${nxb.MaNXB}: ${nxb.TenNXB}`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
    console.log("\nDisconnected from MongoDB");
  }
}

seedNhaXuatBan();
