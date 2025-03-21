# E-commerce API

## Overview

This is a complete e-commerce API built with **Node.js, Express, and MongoDB**. The API provides features for authentication, product management, order processing, shopping cart functionality, discount coupons, user profiles, brand and category management, reviews, and payment integration using **Stripe**.

---

## Features

✅ **User Authentication**: Secure authentication using JWT, including account activation and password reset via email.  
✅ **Role-based Access Control**: Admin and user permissions.  
✅ **Product Management**: CRUD operations for products with image uploads using Multer and Sharp.  
✅ **Category & Subcategory Management**: Organize products into categories and subcategories.  
✅ **Brand Management**: CRUD operations for brands with image support.  
✅ **Cart System**: Users can add/remove/update products in their cart.  
✅ **Order Handling**: Users can place orders, and admins can manage them.  
✅ **Secure Payment Integration**: Payments handled via Stripe with webhook support (**cash on delivery & online payments**).  
✅ **Coupon System**: Discount coupons for users.  
✅ **User Account Management**: Users can manage their profiles, passwords, and addresses.  
✅ **Admin User Management**: Admins can manage all users (CRUD operations).  
✅ **Advanced Search & Filtering**: Filter, sort, search, and paginate data dynamically.  
✅ **Image Upload & Optimization**: Upload, resize, and optimize images using Multer and Sharp.  
✅ **API Documentation**: Integrated Swagger UI for API reference.  
✅ **Robust Routing System**: Organized modular routes for all API functionalities.  
✅ **Error Handling System**: Centralized error handling with clear responses.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT
- **Validation**: Express Validator
- **File Handling**: Multer, Sharp
- **Security**: bcryptjs, express-rate-limit, hpp, cors, helmet
- **Payments**: Stripe (supports checkout sessions & webhooks)
- **Email Services**: Nodemailer

---

## Installation & Setup

### 1️⃣ Clone the Repository

```sh
$ git clone https://github.com/anas-dev000/ecommercify-api.git
$ cd ecommercify-api
```

### 2️⃣ Install Dependencies

```sh
$ npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add the required configurations:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4️⃣ Run the Server

#### For development:

```sh
$ npm run dev
```

#### For production:

```sh
$ npm start
```

---

## API Documentation

📌 **Swagger documentation is available at:**

```
http://localhost:5000/api-docs
```

---

## API Endpoints

### 🔑 **Authentication**

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `POST /api/auth/forgotPassword` - Request password reset code
- `POST /api/auth/verifyResetCode` - Verify reset code
- `PATCH /api/auth/resetPassword` - Reset password (Authenticated users only)

### 👤 **User Profile**

- `GET /api/me` - Get my data
- `PATCH /api/me` - Update my data
- `DELETE /api/me` - Delete my account
- `PATCH /api/me/update-password` - Update my password
- `GET /api/me/addresses` - Get my addresses
- `POST /api/me/addresses` - Add a new address
- `PATCH /api/me/addresses/:addressId` - Update an address
- `DELETE /api/me/addresses/:addressId` - Delete an address

### 🛍️ **Products**

- `GET /api/products` - Get all products
- `POST /api/products` - Add a new product (**Admin only**)
- `GET /api/products/:id` - Get a specific product
- `PATCH /api/products/:id` - Update a product (**Admin only**)
- `DELETE /api/products/:id` - Remove a product (**Admin only**)

### ⭐ **Reviews**

- `POST /api/products/{product}/reviews` - Add a review
- `GET /api/products/{product}/reviews/:id` - Get a specific review
- `PATCH /api/products/{product}/reviews/:id` - Update a review
- `DELETE /api/products/{product}/reviews/:id` - Delete a review

### 📦 **Orders**

- `POST /api/orders` - Create a new order (**cash on delivery & online payment**)
- `GET /api/orders` - Get all orders (**Admin only or user’s orders**)
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/pay` - Mark order as paid
- `PATCH /api/orders/:id/deliver` - Mark order as delivered

### 🛒 **Advanced Search & Filtering**

- Supports **dynamic filtering** using query parameters (e.g., `?price[gte]=100`)
- Supports **keyword search** in names and descriptions.
- Supports **sorting, pagination, and field selection.**

### 📸 **Image Upload & Processing**

- Supports **image uploads** for products and users.
- Uses **Multer** for handling file uploads.
- Uses **Sharp** for **resizing and optimizing** images.

### ⚠️ **Error Handling**

- Centralized error handling through **`globalError.js`**.
- Uses **`apiError.js`** for structured error responses.
- Handles **JWT expiration** and **invalid signatures** gracefully.

---

## Contribution

💡 Feel free to contribute! Fork the repo, make your changes, and submit a pull request.

---

## Author

👤 **Anas Ali Abdelmonem Elgebaly**  
🔗 **GitHub:** [anas-dev000](https://github.com/anas-dev000)
