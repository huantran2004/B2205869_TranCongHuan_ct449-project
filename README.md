# Full-Stack Project: Contact Book Application

Ứng dụng quản lý danh bạ với Backend (Node.js + Express + MongoDB) và Frontend (Vue.js 3).

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
