# 🛒 Bretix - Multi-Vendor E-Commerce Platform

> **"Pretty Expressions" - Your Digital Mall**  
> An electronic marketplace where different stores (supermarkets, pharmacies, electronics, groceries, and more) can register, showcase, and sell their products in one unified platform.

[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-12%2B-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)

---

## 👥 Team

**Logic Cartel**

- **Ahmad Mahmoud Al Hyari** - Full Stack Developer
- **Ahmad Sameer AlBorno** - Full Stack Developer  
- **Mahmoud Mohammed Atef ALshiekh Qasem** - Full Stack Developer

🔗 **GitHub Repository:** [MERAKI_Academy_Project_5](https://github.com/Logic-Cartel/MERAKI_Academy_Project_5)

---

## 💡 The Vision

Bretix transforms the traditional shopping experience into a seamless digital journey. Named after "Pretty Expressions", this platform brings together diverse stores under one roof - from supermarkets and pharmacies to electronics and grocery shops - creating a comprehensive online marketplace that serves both vendors and customers.

**Current Stage:** Bootcamp final project  
**Future Goal:** Real-world commercial platform

---

## ✨ Features

### 👤 For Customers
- 🔍 **Browse multiple stores** - Access products from various vendors in one place
- ❤️ **Favourite stores** - Save preferred stores for quick access
- 🛒 **Smart shopping cart** - Add items from different stores seamlessly
- 💳 **Secure checkout** - Stripe-powered payment integration
- 📧 **Email verification** - Secure account registration
- 📦 **Order tracking** - Monitor your purchases in real-time
- 🔐 **Password recovery** - Easy account management

### 🏪 For Store Owners
- 📊 **Store dashboard** - Comprehensive management interface
- 🎨 **Store customization** - Upload logo, description, and branding
- 📦 **Product management** - Full CRUD operations for inventory
- 💰 **Sales analytics** - Revenue insights and 7-day performance charts
- 📋 **Order management** - Track and process customer orders
- 📈 **Business insights** - Understand your store's performance

### 👨‍💼 For Platform Administrators
- 🌐 **Platform oversight** - Monitor entire marketplace
- 👥 **User management** - Control user accounts and permissions
- 📊 **Global statistics** - Platform-wide analytics
- 🛍️ **Store management** - Oversee all registered stores
- 📦 **Product oversight** - Platform-wide product management

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 14+
PostgreSQL 12+
npm or yarn
Stripe account (for payments)
Gmail account (for emails)
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Logic-Cartel/MERAKI_Academy_Project_5.git
cd MERAKI_Academy_Project_5
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
DB_URL=postgresql://username:password@localhost:5432/bretix
SECRET=your_jwt_secret_min_32_characters
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

**3. Frontend Setup**
```bash
cd frontend/bretix
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

**4. Database Setup**

Create database:
```sql
CREATE DATABASE bretix;
```

The database schema includes multiple tables with various relationship types:
- **One-to-Many:** Users → Store, Store → Products
- **Many-to-Many:** Users ↔ Stores (via Favourites), Cart ↔ Products
- **One-to-One:** Store Owner → Store

Run the schema file to create all necessary tables and relationships.

**5. Access the Application**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **PostgreSQL** - Relational database with complex relationships
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Stripe** - Payment processing

### Frontend
- **React 18** - Modern UI library
- **Redux Toolkit** - Centralized state management
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Stripe.js** - Secure payment forms
- **Lucide React** - Beautiful icons
- **SweetAlert2** - Enhanced user notifications
- **Bootstrap** - Utilized for responsive grid and layout styling
- **Material-UI** - Implemented for advanced, ready-to-use UI components



---

## 📁 Project Structure

```
MERAKI_Academy_Project_5/
├── backend/
│   ├── MVC/
│   │   ├── controllers/      # Business logic
│   │   │   ├── users.js
│   │   │   ├── stores.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── favourites.js
│   │   │   └── categories.js
│   │   ├── routes/           # API endpoints
│   │   ├── models/           # Database connection
│   │   └── middlewares/      # Auth & Authorization
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    └── bretix/
        ├── src/
        │   ├── components/
        │   │   ├── Admin/
        │   │   ├── Owners/
        │   │   ├── User/
        │   │   └── Shared componenets/
        │   ├── redux/
        │   ├── App.jsx
        │   └── main.jsx
        ├── .env.example
        └── package.json
```

---

## 🗄️ Database Architecture

The platform uses PostgreSQL with a sophisticated relational schema:

### Core Tables
- `users` - Customer, owner, and admin accounts
- `store` - Store information and branding
- `products` - Product catalog with store associations
- `categories` - Product categorization
- `cart` & `cart_products` - Shopping cart system
- `favourites` - User's saved stores (Many-to-Many)

### Relationship Types
- **One-to-Many:** Owner → Store, Store → Products, Category → Products
- **Many-to-Many:** Users ↔ Stores (favourites), Cart ↔ Products
- **Foreign Keys:** Ensure referential integrity across all tables
- **Cascade Deletes:** Automatic cleanup of dependent records

---

## 👥 User Roles & Permissions

| Role | ID | Capabilities |
|------|-----|-------------|
| **Customer** | 1 | Browse, purchase, save favourites, track orders |
| **Store Owner** | 2 | Manage own store, products, orders, view analytics |
| **Administrator** | 3 | Full platform access, user management, oversight |

---

## 🔌 Key API Endpoints

### Authentication
```
POST   /users/register           - Create account
POST   /users/login              - User authentication
POST   /users/forget-password    - Request reset
POST   /users/reset-password     - Complete reset
```

### Favourites System
```
POST   /favourites               - Add store to favourites
DELETE /favourites/:store_id     - Remove from favourites
GET    /favourites               - Get user's favourites
GET    /favourites/check/:id     - Check favourite status
```

### Store & Product Management
```
GET    /stores/all               - Browse all stores
GET    /stores/:id               - Store details
GET    /stores/:id/products      - Store's products
POST   /products                 - Add product (Owner)
PUT    /products/:id/update      - Update product (Owner)
DELETE /products/:id             - Remove product (Owner)
```

### Shopping & Checkout
```
POST   /cart                     - Add to cart
GET    /cart/getCartWhereIsDeletedFalse - Active cart
DELETE /cart/:id                 - Remove item
POST   /cart/complete/:cart_id   - Checkout
```

---

## 💳 Payment Integration

Bretix uses **Stripe** for secure payment processing.

### Setup:
1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard
3. Add to environment variables:
   - Backend: `STRIPE_SECRET_KEY`
   - Frontend: `VITE_STRIPE_PUBLIC_KEY`

### Test Cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

---

## 🗺️ Roadmap & Future Vision

### Phase 1: Current (Bootcamp Project) ✅
- Multi-vendor marketplace
- User authentication & roles
- Shopping cart & checkout
- Favourites system
- Store analytics

### Phase 2: Real-World Implementation 🚀
- **Barcode Integration** - Display same product from multiple stores based on unified product codes
- **Live Payment Gateway** - Transition from test to production payment processing
- **Advanced Delivery System** - Integration with modern logistics and tracking systems
- **Enhanced UX** - Simplified, intuitive interface solving real shopping problems
- **Trust Building** - Implement verified seller badges, ratings, and review systems
- **Store Optimization** - Help vendors showcase their best products effectively
- **Community Trust** - Bridge the gap between local communities and e-commerce

### Long-term Goals 🌟
- Mobile applications (iOS & Android)
- Real-time inventory tracking
- AI-powered product recommendations
- Multi-language support
- Advanced analytics for vendors
- Integration with popular accounting software

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration & login
- [ ] Email verification system
- [ ] Password reset flow
- [ ] Browse stores and products
- [ ] Add/remove items from cart
- [ ] Favourite stores functionality
- [ ] Complete purchase via Stripe
- [ ] Store owner dashboard
- [ ] Product CRUD operations
- [ ] Admin panel access

---

## 🚀 Deployment

**Status:** Deployment in progress (expected within 2 days)

The application will be deployed using:
- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway
- **Database:** Neon or Supabase PostgreSQL

Live URL will be added upon deployment completion.

---

## 🎓 Learning Outcomes

This project demonstrates mastery in:
- Full-stack JavaScript development (PERN stack)
- Complex database design with multiple relationship types
- RESTful API architecture
- Modern React patterns and hooks
- State management with Redux
- Authentication & authorization (JWT)
- Third-party API integration (Stripe)
- Team collaboration and Git workflow
- Agile development methodology

---

## 🤝 Contributing

This is currently a bootcamp project. However, we welcome suggestions and feedback!

For major changes:
1. Open an issue to discuss proposed changes
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

---

## 📝 License

This project is developed as part of MERAKI Academy Bootcamp curriculum.

---

## 🏫 About MERAKI Academy

This project represents the culmination of an intensive 22-week full-stack development bootcamp at MERAKI Academy, where we learned modern web development practices, team collaboration, and professional software engineering principles.

---

## 🙏 Acknowledgments

- **MERAKI Academy** - For the comprehensive bootcamp program and mentorship
- **Stripe** - For providing robust payment processing APIs
- **Our Instructors** - For guidance throughout the learning journey
- **The Open Source Community** - For amazing tools and libraries

---

## 💭 The Story Behind Bretix

**Bretix** is more than just a bootcamp project - it represents a vision that started 6 years ago. The name comes from "**Pretty Expressions**", reflecting the idea of creating beautiful, meaningful interactions in the digital shopping space. While the original vision was delayed by circumstances, this bootcamp provided the perfect opportunity to bring it to life.

Our goal isn't just to build another e-commerce platform - we aim to solve real problems: making online shopping trustworthy for our communities, helping local stores thrive digitally, and creating a seamless bridge between traditional shopping and modern convenience.

---

## 📞 Contact & Support

### Team Members
- Ahmad Mahmoud Al Hyari
- Ahmad Sameer AlBorno
- Mahmoud Mohammed Atef ALshiekh Qasem

### Repository
🔗 [github.com/Logic-Cartel/MERAKI_Academy_Project_5](https://github.com/Logic-Cartel/MERAKI_Academy_Project_5)

For questions, suggestions, or collaboration inquiries, please open an issue on GitHub.

---

## 🌟 Project Status

**Current Phase:** Bootcamp Final Project ✅  
**Deployment:** In Progress 🚀  
**Future:** Real-world Implementation 🎯

---

**Built with ❤️ by Logic Cartel Team**  
**Powered by React, Node.js, PostgreSQL, and ambition**

---

*"From Pretty Expressions to Real Solutions"*
