# Ứng dụng Quản lý Mượn Sách - B2205869_TranCongHuan

Ứng dụng full-stack quản lý thư viện với Backend sử dụng NodeJS/ExpressJS và Frontend sử dụng VueJS.

## ✨ **TÍNH NĂNG MỚI: AI VOICE SEARCH (TÌM KIẾM BẰNG GIỌNG NÓI)**

🎤 Hệ thống đã tích hợp **AI Voice Search** sử dụng Web Speech API!

**Tính năng:**
- 🎙️ Nhận diện giọng nói tiếng Việt
- 🔊 Phản hồi bằng giọng nói (Text-to-Speech)
- 🔍 Tự động tìm kiếm sách
- 🎨 Giao diện đẹp với animation

**Hỗ trợ:**
- ✅ Chrome, Edge, Safari
- ✅ Tiếng Việt (vi-VN)
- ✅ Mobile-friendly

📖 **Xem hướng dẫn chi tiết:** [AI_VOICE_SEARCH.md](./AI_VOICE_SEARCH.md)

---

## 📋 Yêu cầu hệ thống

- **Node.js**: v16 trở lên
- **MongoDB**: v6 trở lên
- **npm**: v8 trở lên

## 🚀 Cách chạy ứng dụng

### Bước 1: Khởi động MongoDB

Mở terminal và chạy lệnh:

```bash
mongod --dbpath ~/data/db
```

**Lưu ý:** Giữ terminal này chạy, không tắt!

---

### Bước 2: Cài đặt và chạy Backend

Mở terminal **MỚI** và thực hiện:

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies (chỉ cần làm 1 lần)
npm install

# Chạy server
node server.js
```

✅ Backend sẽ chạy tại: **http://localhost:3000**

Bạn sẽ thấy thông báo:
```
Server is running on port 3000
Connected to the database!
```

---

### Bước 3: Cài đặt và chạy Frontend

Mở terminal **MỚI** (terminal thứ 3) và thực hiện:

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies (chỉ cần làm 1 lần)
npm install

# Chạy dev server
npm run dev
```

✅ Frontend sẽ chạy tại: **http://localhost:3001**

---

### Bước 4: Mở ứng dụng

Truy cập: **http://localhost:3001** trong trình duyệt

---

## 📁 Cấu trúc Database

Ứng dụng sử dụng MongoDB với 5 collections:

1. **docgia** - Quản lý độc giả (MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai)
2. **sach** - Quản lý sách (MaSach, TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, NguonGoc, TacGia)
3. **nhaxuatban** - Quản lý nhà xuất bản (MaNXB, TenNXB, DiaChi)
4. **theodoimuonsach** - Theo dõi mượn sách (MaDocGia, MaSach, NgayMuon, NgayTra)
5. **nhanvien** - Quản lý nhân viên (MSNV, HoTenNV, Password, ChucVu, DiaChi, SoDienThoai)

---

## 🔌 API Endpoints

### Độc giả (`/api/docgia`)
- `GET /api/docgia` - Lấy danh sách độc giả
- `GET /api/docgia/:id` - Lấy thông tin 1 độc giả
- `POST /api/docgia` - Thêm độc giả mới
- `PUT /api/docgia/:id` - Cập nhật độc giả
- `DELETE /api/docgia/:id` - Xóa độc giả
- `DELETE /api/docgia` - Xóa tất cả độc giả

### Sách (`/api/sach`)
- `GET /api/sach` - Lấy danh sách sách
- `GET /api/sach/:id` - Lấy thông tin 1 sách
- `POST /api/sach` - Thêm sách mới
- `PUT /api/sach/:id` - Cập nhật sách
- `DELETE /api/sach/:id` - Xóa sách
- `DELETE /api/sach` - Xóa tất cả sách

### Nhà xuất bản (`/api/nhaxuatban`)
- `GET /api/nhaxuatban` - Lấy danh sách nhà xuất bản
- `GET /api/nhaxuatban/:id` - Lấy thông tin 1 nhà xuất bản
- `POST /api/nhaxuatban` - Thêm nhà xuất bản mới
- `PUT /api/nhaxuatban/:id` - Cập nhật nhà xuất bản
- `DELETE /api/nhaxuatban/:id` - Xóa nhà xuất bản
- `DELETE /api/nhaxuatban` - Xóa tất cả nhà xuất bản

### Theo dõi mượn sách (`/api/theodoimuonsach`)
- `GET /api/theodoimuonsach` - Lấy danh sách mượn sách
- `GET /api/theodoimuonsach/chuatra` - Lấy danh sách sách chưa trả
- `GET /api/theodoimuonsach/:id` - Lấy thông tin 1 bản ghi
- `POST /api/theodoimuonsach` - Thêm bản ghi mượn sách
- `PUT /api/theodoimuonsach/:id` - Cập nhật (trả sách)
- `DELETE /api/theodoimuonsach/:id` - Xóa bản ghi
- `DELETE /api/theodoimuonsach` - Xóa tất cả bản ghi

### Nhân viên (`/api/nhanvien`)
- `GET /api/nhanvien` - Lấy danh sách nhân viên
- `GET /api/nhanvien/:id` - Lấy thông tin 1 nhân viên
- `POST /api/nhanvien` - Thêm nhân viên mới
- `POST /api/nhanvien/login` - Đăng nhập nhân viên
- `PUT /api/nhanvien/:id` - Cập nhật nhân viên
- `DELETE /api/nhanvien/:id` - Xóa nhân viên
- `DELETE /api/nhanvien` - Xóa tất cả nhân viên

---

## 🛠️ Công nghệ sử dụng

### Backend
- Node.js + Express.js 5.1.0
- MongoDB Driver 6.20.0 (native driver)
- CORS, dotenv

### Frontend
- Vue.js 3.5.22
- Vue Router 4.6.3
- Bootstrap 4.6.2
- Font Awesome 7.1.0
- Axios 1.13.2
- Vee-Validate 4.15.1 + Yup 1.7.1
- Vite 7.1.11

### 🤖 AI Features
- **Web Speech API** - Speech Recognition (tiếng Việt)
- **Web Speech API** - Speech Synthesis (Text-to-Speech)
- **VoiceSearch Component** - Reusable AI component

---

## 📝 Ghi chú

- **Backend** sử dụng MongoDB native driver, KHÔNG dùng Mongoose
- **Frontend** hiện tại vẫn đang hiển thị giao diện Contact Book (chưa cập nhật UI cho quản lý mượn sách)
- Sử dụng **MongoDB Compass** để xem và quản lý database tại `mongodb://localhost:27017`
- Database sẽ tự động được tạo khi có dữ liệu đầu tiên

---

## 🐛 Khắc phục sự cố

### MongoDB không chạy được
```bash
# Tạo thư mục data nếu chưa có
mkdir -p ~/data/db

# Chạy lại MongoDB
mongod --dbpath ~/data/db
```

### Port 3000 hoặc 3001 đã được sử dụng
```bash
# Tìm process đang dùng port
lsof -i :3000
lsof -i :3001

# Kill process (thay PID bằng số tìm được)
kill -9 PID
```

### Lỗi kết nối database
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra file `.env` trong thư mục backend (nếu có)
- Mặc định kết nối tới: `mongodb://localhost:27017`

---

## 👨‍💻 Thông tin sinh viên

- **MSSV**: B2205869
- **Họ tên**: Trần Công Huân
- **Môn học**: CT449 - Phát triển ứng dụng Web

## 📋 Mục lục

- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [API Endpoints](#api-endpoints)

## 🏗️ Cấu trúc dự án

```
project-root/
├── backend/              # Node.js + Express backend
│   ├── app/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
│
├── frontend/            # Vue.js 3 frontend
│   └── src/
│       ├── components/  # Reusable components
│       ├── views/       # Page components
│       ├── services/    # API services
│       ├── router/      # Vue Router
│       └── assets/      # CSS, images
│
└── README.md
```

## 💻 Yêu cầu hệ thống

- Node.js >= 20.19.0 hoặc >= 22.12.0
- npm >= 6.x
- MongoDB >= 4.x (MongoDB Compass)

## 🚀 Cài đặt

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Cập nhật MONGODB_URI trong file .env nếu cần
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

## ▶️ Chạy ứng dụng

### Chạy Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

### Chạy Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

App sẽ chạy tại: http://localhost:3001

## 📡 API Endpoints

### Contacts

- `GET /api/contacts` - Lấy danh sách contacts
- `GET /api/contacts/:id` - Lấy contact theo ID
- `GET /api/contacts/favorite` - Lấy contacts yêu thích
- `POST /api/contacts` - Tạo contact mới
- `PUT /api/contacts/:id` - Cập nhật contact
- `DELETE /api/contacts/:id` - Xóa contact
- `DELETE /api/contacts` - Xóa tất cả contacts

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (sử dụng mongodb driver, không dùng mongoose)

### Frontend
- **Vue.js 3** - Progressive framework
- **Vue Router** - Routing
- **Axios** - HTTP client
- **Bootstrap 4** - CSS framework
- **Font Awesome** - Icons
- **Vee-Validate** - Form validation
- **Yup** - Schema validation
- **Vite** - Build tool

## 📝 Tính năng

- ✅ CRUD operations cho contacts
- ✅ Tìm kiếm contacts
- ✅ Đánh dấu contacts yêu thích
- ✅ Form validation
- ✅ Responsive design với Bootstrap
- ✅ RESTful API

## 📝 License

ISC
