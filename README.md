# 🛒 ShopEasy - Full-Stack E-Commerce Platform

<div align="center">

![ShopEasy Banner](./public/home.png)

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A high-performance, secure, and scalable e-commerce solution for modern web**

🌐 [Live Demo](https://ecom-frontend-pi-sandy.vercel.app) 

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Performance & Security](#performance--security)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**ShopEasy** is a full-stack MERN-based e-commerce platform designed for **speed**, **security**, and **scalability**. It provides users with a seamless shopping experience — from browsing products to secure checkout — while offering admins powerful tools for managing products, orders, and analytics.

### 🧩 Key Highlights

- ⚡ **Performance** — Redis caching & optimized database queries for lightning-fast responses
- 🔒 **Security** — JWT authentication, bcrypt hashing, Helmet.js protection, and rate limiting
- 📈 **Scalability** — Modular architecture deployed with Vercel & Railway for effortless scaling
- 💳 **Integrated Payments** — Razorpay checkout with support for multiple payment methods
- 🧠 **Smart Admin Panel** — Real-time analytics, revenue tracking, and order insights

---

## ✨ Features

### 👤 Customer Features

- **Authentication & Authorization**: Secure user registration and login with JWT tokens
- **Product Browsing**: Browse products with advanced search, filter by category, price range, and ratings
- **Shopping Cart**: Add, remove, and update product quantities in real-time
- **Checkout Flow**: Seamless checkout with Cash on Delivery (COD) or Razorpay payment integration
- **Order Management**: View order history, track shipment status, and download invoices
- **User Profile**: Edit personal information, manage shipping addresses, and update preferences
- **Wishlist**: Save favorite products for later purchase
- **Product Reviews**: Rate and review purchased products

### 🧑‍💼 Admin Features

- **Product Management**: Complete CRUD operations for products with image uploads and inventory tracking
- **Category Management**: Create, edit, and organize product categories and subcategories
- **Order Management**: View all orders, update order status, process refunds, and cancel orders
- **Analytics Dashboard**: Visualize sales trends, revenue metrics, user growth, and popular products
- **User Management**: View registered users, manage permissions, and monitor user activity
- **Inventory Control**: Track stock levels, set low-stock alerts, and manage product availability

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18, React Router v6, Context API, Axios, Tailwind CSS, React Query |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Redis, JWT, Bcrypt.js, Razorpay SDK |
| **DevOps / Deployment** | Vercel (Frontend), Railway (Backend), MongoDB Atlas (Database), Redis Cloud |
| **Additional Tools** | Helmet.js, Express Rate Limit, Multer, Cors, Dotenv, Nodemailer |

---

## 🏗️ Architecture

![ShopEasy Banner](./public/Ecomarchitecture.png)

**Architecture Overview:**

- **Client (React + Tailwind)**: Single-page application with responsive UI and state management via Context API
- **API Layer (Express)**: RESTful API handling authentication, CRUD operations, and business logic
- **Redis Cache**: High-performance caching for frequently accessed data (products, categories)
- **MongoDB Atlas**: Persistent storage for products, orders, users, and application data
- **Razorpay Gateway**: Secure payment processing with webhook support for order confirmation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- MongoDB Atlas account (or local MongoDB)
- Redis instance (local or cloud)
- Razorpay account for payment integration

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/shopeasy.git
cd shopeasy
```

**2. Backend Setup**

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

**Backend Environment Variables (.env)**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopeasy?retryWrites=true&w=majority

# Redis
REDIS_URL=redis://localhost:6379
# Or for Redis Cloud: redis://default:password@redis-12345.c1.cloud.redislabs.com:12345

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Email (Optional - for order confirmations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**3. Frontend Setup**

```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
```

**Frontend Environment Variables (.env)**

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**4. Run the Application**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Sample Admin Credentials

```
Email: admin@shopeasy.com
Password: Admin@123
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PUT | `/auth/profile` | Update profile | ✅ |
| POST | `/auth/logout` | Logout user | ✅ |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (with filters) | ❌ |
| GET | `/products/:id` | Get product by ID | ❌ |
| POST | `/products` | Create product | ✅ (Admin) |
| PUT | `/products/:id` | Update product | ✅ (Admin) |
| DELETE | `/products/:id` | Delete product | ✅ (Admin) |
| GET | `/products/featured` | Get featured products | ❌ |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories | ❌ |
| GET | `/categories/:id` | Get category by ID | ❌ |
| POST | `/categories` | Create category | ✅ (Admin) |
| PUT | `/categories/:id` | Update category | ✅ (Admin) |
| DELETE | `/categories/:id` | Delete category | ✅ (Admin) |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | ✅ |
| POST | `/cart/add` | Add item to cart | ✅ |
| PUT | `/cart/update/:itemId` | Update cart item quantity | ✅ |
| DELETE | `/cart/remove/:itemId` | Remove item from cart | ✅ |
| DELETE | `/cart/clear` | Clear entire cart | ✅ |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order | ✅ |
| GET | `/orders` | Get user orders | ✅ |
| GET | `/orders/:id` | Get order by ID | ✅ |
| GET | `/orders/admin/all` | Get all orders | ✅ (Admin) |
| PUT | `/orders/:id/status` | Update order status | ✅ (Admin) |
| DELETE | `/orders/:id` | Cancel order | ✅ |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments/create-order` | Create Razorpay order | ✅ |
| POST | `/payments/verify` | Verify payment signature | ✅ |
| POST | `/payments/webhook` | Razorpay webhook handler | ❌ |

**Sample Request - Create Product**

```bash
POST /api/products
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 2999,
  "category": "electronics",
  "stock": 50,
  "images": ["image_url_1", "image_url_2"],
  "featured": true
}
```

**Sample Response**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456789",
    "name": "Wireless Headphones",
    "price": 2999,
    "stock": 50,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 📸 Screenshots

### Home Page
![Home Page](./public//home.png)

### Dashboard
![Product Details](./public//ShopDashboard.png)

### Admin
![Shopping Cart](./public/Admin.png)

### Oder Page
![Admin Dashboard](./public//Orders.png)

### Razorpay
![Order Management](./public/Razorpay.png)

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and import your repository
3. Configure environment variables in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   ```
4. Deploy with one click!

### Backend Deployment (Railway)

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_atlas_uri>
   REDIS_URL=<your_redis_cloud_uri>
   JWT_SECRET=<strong_secret_key>
   RAZORPAY_KEY_ID=<live_key_id>
   RAZORPAY_KEY_SECRET=<live_key_secret>
   CLIENT_URL=https://your-app.vercel.app
   ```
4. Railway will automatically deploy your backend

### Database Setup (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist Railway's IP addresses (or allow access from anywhere for development)
3. Create a database user with read/write permissions
4. Copy the connection string and add to your environment variables
5. Run database migrations if needed:
   ```bash
   npm run seed  # Optional: Seed initial data
   ```

### Redis Setup (Redis Cloud)

1. Sign up for [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
2. Create a free database instance
3. Copy the connection URL and add to environment variables
4. Test connection from your Railway backend

---

## 🔒 Performance & Security

### Performance Optimizations

- **Redis Caching**: Frequently accessed data (products, categories) cached with 5-minute TTL, reducing database queries by up to 80%
- **Database Indexing**: Optimized indexes on `productId`, `userId`, `category`, and `createdAt` fields for faster queries
- **Lazy Loading**: React lazy loading for route-based code splitting, reducing initial bundle size by 40%
- **Image Optimization**: Images served via CDN with automatic compression and responsive sizing
- **API Response Compression**: Gzip compression enabled for all API responses
- **Connection Pooling**: MongoDB connection pool configured for optimal concurrent request handling

### Security Features

- **JWT Authentication**: Secure token-based authentication with httpOnly cookies and automatic token refresh
- **Password Hashing**: Bcrypt with 10 salt rounds for secure password storage
- **Helmet.js**: HTTP headers secured against common vulnerabilities (XSS, clickjacking, MIME sniffing)
- **Rate Limiting**: API rate limiting (100 requests/15 minutes per IP) to prevent abuse and DDoS attacks
- **CORS Configuration**: Strict CORS policy allowing only whitelisted frontend domains
- **Input Validation**: Comprehensive validation and sanitization using express-validator
- **SQL Injection Prevention**: Mongoose parameterized queries protect against NoSQL injection
- **Payment Security**: Razorpay signature verification ensures payment authenticity
- **Environment Variables**: Sensitive data stored securely in environment variables, never committed to repository

### Monitoring & Logging

- Request logging with Morgan middleware
- Error tracking and monitoring (ready for integration with Sentry)
- Performance metrics tracking with custom middleware

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Contribution Workflow

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/shopeasy.git
   cd shopeasy
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** against the `main` branch with a clear description of your changes

### Contribution Guidelines

- Write clean, maintainable code following existing patterns
- Include comments for complex logic
- Update documentation for any API or feature changes
- Add tests for new features when possible
- Ensure all tests pass before submitting PR
- Follow the existing code style and formatting

### Reporting Issues

Found a bug or have a feature request? Please open an issue on GitHub with:
- Clear description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

---

## 📄 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software for personal or commercial purposes.

See the [LICENSE](LICENSE) file for full details.

---

<div align="center">

### ⭐ If you find ShopEasy helpful, please consider giving it a star!

**Built with ❤️ by [Shubz](https://github.com/Shubz224)**

[⬆ Back to Top](#-shopeasy---full-stack-e-commerce-platform)

</div>