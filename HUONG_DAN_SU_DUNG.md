# Hướng dẫn Sử dụng Hệ thống Quản lý Mượn Sách

## Tổng quan

Hệ thống quản lý mượn sách bao gồm 2 phần chính:
- **Admin**: Dành cho nhân viên thư viện quản lý hệ thống
- **Client**: Dành cho độc giả tra cứu và mượn sách

## Các Chức năng Chính

### 🔐 Hệ thống Đăng nhập

#### Đăng nhập Admin
- **URL**: `http://localhost:3001/admin/login`
- **Thông tin đăng nhập**: Sử dụng MSNV và Password
- **Quyền hạn**: Quản lý toàn bộ hệ thống

#### Đăng nhập Client (Độc giả)
- **URL**: `http://localhost:3001/client/login`
- **Thông tin đăng nhập**: Sử dụng Mã Độc Giả và Password
- **Quyền hạn**: Xem sách, mượn sách, xem lịch sử

---

## 👨‍💼 Chức năng Admin

### 1. Dashboard Admin
- Xem thông tin tài khoản
- Truy cập nhanh các chức năng quản lý

### 2. Thống kê Tổng quan (`/admin/statistics`)
**Hiển thị:**
- Tổng số sách trong thư viện
- Tổng số độc giả đã đăng ký
- Số sách đang được mượn
- Tổng số nhà xuất bản

**Bảng dữ liệu:**
- Phiếu mượn gần đây (10 phiếu mới nhất)
- Danh sách sách có sẵn trong kho

### 3. Quản lý Sách (`/admin/sach`)
**Chức năng:**
- ✅ Xem danh sách tất cả sách
- ✅ Tìm kiếm sách theo tên, tác giả
- ✅ Lọc sách yêu thích
- ✅ Thêm sách mới
- ✅ Sửa thông tin sách
- ✅ Xóa sách

**Thông tin sách:**
- Mã sách, Tên sách, Tác giả
- Năm xuất bản, Mã NXB
- Số quyển, Đơn giá
- Trạng thái yêu thích

### 4. Quản lý Độc Giả (`/admin/docgia`)
**Chức năng:**
- ✅ Xem danh sách độc giả
- ✅ Tìm kiếm theo tên, mã, số điện thoại
- ✅ Thêm độc giả mới
- ✅ Cập nhật thông tin độc giả
- ✅ Xóa độc giả
- ✅ Tạo tài khoản đăng nhập cho độc giả

**Thông tin độc giả:**
- Mã độc giả, Họ lót, Tên
- Ngày sinh, Phái
- Địa chỉ, Điện thoại
- Mật khẩu (chỉ khi tạo mới)

### 5. Quản lý Nhân Viên (`/admin/nhanvien`)
**Chức năng:**
- ✅ Xem danh sách nhân viên
- ✅ Tìm kiếm theo MSNV, tên, chức vụ
- ✅ Thêm nhân viên mới
- ✅ Cập nhật thông tin
- ✅ Xóa nhân viên
- ✅ Tạo tài khoản đăng nhập

**Chức vụ:**
- Quản lý
- Thủ thư
- Nhân viên

### 6. Quản lý Nhà Xuất Bản (`/admin/nhaxuatban`)
**Chức năng:**
- ✅ Xem danh sách NXB
- ✅ Tìm kiếm NXB
- ✅ Thêm NXB mới
- ✅ Cập nhật thông tin
- ✅ Xóa NXB

**Thông tin NXB:**
- Mã NXB, Tên NXB
- Địa chỉ

### 7. Theo dõi Mượn Sách (`/admin/theodoimuonsach`)
**Chức năng:**
- ✅ Xem tất cả phiếu mượn
- ✅ Lọc theo trạng thái:
  - Tất cả
  - Chưa trả
  - Đã trả
- ✅ Tìm kiếm theo mã độc giả hoặc mã sách
- ✅ Tạo phiếu mượn mới
- ✅ Xác nhận trả sách
- ✅ Xóa phiếu mượn

**Thông tin phiếu:**
- Mã độc giả, Mã sách
- Ngày mượn, Ngày trả
- Trạng thái (Đang mượn/Đã trả)

---

## 👨‍🎓 Chức năng Client (Độc giả)

### 1. Dashboard Client
- Xem thông tin cá nhân
- Truy cập nhanh các chức năng

### 2. Danh sách Sách (`/client/books`)
**Chức năng:**
- ✅ Xem tất cả sách có sẵn
- ✅ Tìm kiếm sách theo tên, tác giả
- ✅ Sắp xếp theo:
  - Tên sách (A-Z)
  - Giá (Thấp - Cao)
  - Năm xuất bản
- ✅ Yêu cầu mượn sách trực tuyến

**Hiển thị thông tin:**
- Tên sách, Tác giả
- Năm xuất bản, NXB
- Số lượng còn
- Đơn giá
- Nút "Yêu cầu mượn" (nếu còn sách)

### 3. Lịch sử Mượn Sách (`/client/history`)
**Chức năng:**
- ✅ Xem lịch sử mượn sách cá nhân
- ✅ Lọc theo trạng thái:
  - Tất cả
  - Đang mượn
  - Đã trả
- ✅ Xem trạng thái quá hạn (nếu mượn quá 30 ngày)

**Thống kê cá nhân:**
- Tổng số lần mượn
- Số sách đang mượn
- Số sách đã trả

**Thông tin hiển thị:**
- Mã sách
- Ngày mượn, Ngày trả
- Trạng thái (Đang mượn/Đã trả/Quá hạn)
- Thời gian mượn (tính bằng ngày)

---

## 🚀 Hướng dẫn Khởi động

### 1. Khởi động MongoDB
```bash
mongod --dbpath ~/data/db
```

### 2. Khởi động Backend
```bash
cd backend
node server.js
```
- Backend chạy tại: `http://localhost:3000`

### 3. Khởi động Frontend
```bash
cd frontend
npm run dev
```
- Frontend chạy tại: `http://localhost:3001`

---

## 📝 Ghi chú Quan trọng

### Validation
- Tất cả form đều có validation với Vee-Validate
- Hiển thị lỗi bằng tiếng Việt
- Các trường bắt buộc được đánh dấu `*`

### Bảo mật
- Mật khẩu chỉ yêu cầu khi **tạo mới** người dùng
- Khi **cập nhật**, không cần nhập lại mật khẩu
- Mỗi loại người dùng có path đăng nhập riêng
- Navigation guards bảo vệ các route theo quyền

### Quy định Mượn sách
- Thời gian mượn tối đa: **30 ngày**
- Sau 30 ngày, hệ thống đánh dấu "Quá hạn"
- Độc giả có thể yêu cầu mượn trực tuyến, sau đó đến thư viện nhận sách

### UI/UX
- **Admin**: Giao diện màu tím (Purple theme)
- **Client**: Giao diện màu xanh lá (Green theme)
- Responsive design với Bootstrap 4
- Font Awesome icons
- Modal dialogs cho các form thêm/sửa

---

## 🔧 API Endpoints

### Authentication
- `POST /api/nhanvien/login` - Đăng nhập admin
- `POST /api/docgia/login` - Đăng nhập client

### Sách
- `GET /api/sach` - Lấy tất cả sách
- `GET /api/sach/:id` - Lấy 1 sách
- `POST /api/sach` - Tạo sách mới
- `PUT /api/sach/:id` - Cập nhật sách
- `DELETE /api/sach/:id` - Xóa sách

### Độc giả
- `GET /api/docgia` - Lấy tất cả độc giả
- `POST /api/docgia` - Tạo độc giả mới
- `PUT /api/docgia/:id` - Cập nhật độc giả
- `DELETE /api/docgia/:id` - Xóa độc giả

### Nhân viên
- `GET /api/nhanvien` - Lấy tất cả nhân viên
- `POST /api/nhanvien` - Tạo nhân viên mới
- `PUT /api/nhanvien/:id` - Cập nhật nhân viên
- `DELETE /api/nhanvien/:id` - Xóa nhân viên

### Nhà xuất bản
- `GET /api/nhaxuatban` - Lấy tất cả NXB
- `POST /api/nhaxuatban` - Tạo NXB mới
- `PUT /api/nhaxuatban/:id` - Cập nhật NXB
- `DELETE /api/nhaxuatban/:id` - Xóa NXB

### Theo dõi mượn sách
- `GET /api/theodoimuonsach` - Lấy tất cả phiếu mượn
- `GET /api/theodoimuonsach/chuatra` - Lấy phiếu chưa trả
- `POST /api/theodoimuonsach` - Tạo phiếu mượn mới
- `PUT /api/theodoimuonsach/:id` - Cập nhật phiếu (trả sách)
- `DELETE /api/theodoimuonsach/:id` - Xóa phiếu

---

## 🎯 Test Flow

### Test Admin Flow
1. Truy cập `http://localhost:3001/admin/login`
2. Đăng nhập với tài khoản admin đã tạo
3. Xem Dashboard và Thống kê
4. Thử các chức năng CRUD trên mỗi module
5. Test tạo phiếu mượn sách
6. Đăng xuất

### Test Client Flow
1. Truy cập `http://localhost:3001/client/login`
2. Đăng nhập với tài khoản độc giả
3. Xem danh sách sách
4. Thử yêu cầu mượn sách
5. Xem lịch sử mượn sách
6. Đăng xuất

---

## 📚 Technology Stack

**Backend:**
- Node.js + Express.js 5.1.0
- MongoDB Driver 6.20.0 (Native)
- Architecture: MVC + Service Layer

**Frontend:**
- Vue.js 3.5.22 (Options API)
- Vue Router 4.6.3 (SPA with HTML5 History)
- Vee-Validate 4.15.1 + Yup 1.7.1
- Bootstrap 4.6.2
- Axios 1.13.2
- Font Awesome 6.7.2

**Database:**
- MongoDB 6.x
- Database: `quanlysach`
- Collections: 5 (Sach, DocGia, NhanVien, NhaXuatBan, TheoDoiMuonSach)

---

## ✅ Checklist Chức năng Đã hoàn thành

### Admin
- ✅ Đăng nhập/Đăng xuất
- ✅ Dashboard với thông tin cá nhân
- ✅ Thống kê tổng quan
- ✅ CRUD Sách (có tìm kiếm, lọc)
- ✅ CRUD Độc giả (có validation mật khẩu)
- ✅ CRUD Nhân viên (có phân quyền)
- ✅ CRUD Nhà xuất bản
- ✅ CRUD Phiếu mượn sách (có lọc theo trạng thái)

### Client
- ✅ Đăng nhập/Đăng xuất
- ✅ Dashboard với thông tin cá nhân
- ✅ Xem danh sách sách (có search, sort)
- ✅ Yêu cầu mượn sách online
- ✅ Xem lịch sử mượn sách cá nhân
- ✅ Thống kê cá nhân
- ✅ Hiển thị trạng thái quá hạn

### Common
- ✅ Navigation guards (bảo vệ route theo quyền)
- ✅ Dynamic header (hiển thị trạng thái login)
- ✅ Form validation (Vee-Validate)
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

---

Hệ thống đã hoàn thiện đầy đủ các chức năng cơ bản cho việc quản lý thư viện!
