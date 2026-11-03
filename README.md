# Bazaarly

Bazaarly is a RESTful e-commerce API built with NestJS and TypeScript. It provides the backend functionality for an online store, including user authentication, product and category management, shopping baskets, bookmarks, orders, discount codes, and payment processing.

The project follows a modular structure and uses TypeORM with MySQL for data persistence.

## Screenshots

<table>
  <tr>
    <td align="center"><strong>Login</strong></td>
    <td align="center"><strong>Register</strong></td>
    <td align="center"><strong>Products</strong></td>
  </tr>
  <tr>
    <td><img src="./screenshots/login.png" width="250" alt="Login"></td>
    <td><img src="./screenshots/register.png" width="250" alt="Register"></td>
    <td><img src="./screenshots/products.png" width="250" alt="Products"></td>
  </tr>
</table>

## Features

- User registration and authentication
- JWT-based authentication and role-based authorization
- User management and admin account creation
- Product and category management
- Product bookmarking
- Shopping basket management
- Address management
- Order creation and cancellation
- Order status management
- Discount code creation and validation
- Payment integration with Zibal
- Ticket management
- Input validation and data transformation
- Password hashing with bcrypt
- MySQL database integration using TypeORM

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** TypeORM
- **Authentication:** Passport, JWT
- **Password Hashing:** bcrypt
- **Validation:** class-validator, class-transformer
- **Payment Gateway:** Zibal

## Project Structure

```text
src/
├── auth/
│   ├── dto/
│   ├── strategies/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
│
├── users/
├── products/
├── category/
├── address/
├── basket/
├── bookmarks/
├── tickets/
├── discount-code/
├── orders/
├── payment/
│
├── app.module.ts
└── main.ts

postman/
└── Bazaarly-store.postman_collection.json

screenshots/
├── login.png
├── register.png
└── products.png

.env.example
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 22 or later
- npm
- MySQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/benyamin-haghighy/bazaarly-api.git
```

2. Navigate to the project directory:

```bash
cd bazaarly-api
```

3. Install dependencies:

```bash
npm install
```

4. Create a MySQL database:

```sql
CREATE DATABASE shop;
```

5. Create your environment file:

```bash
cp .env.example .env
```

6. Configure the environment variables in `.env`.

7. Start the development server:

```bash
npm run start:dev
```

The application will run on the port specified in your environment configuration.

## Environment Variables

The project uses environment variables for database configuration, authentication, and payment gateway settings.

| Variable | Description |
|---|---|
| `PORT` | Application port |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | Database name |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `ACCESS_TOKEN_SECRETE_KEY` | Access token secret |
| `ACCESS_TOKEN_EXPIRE` | Access token expiration |
| `REFRESH_TOKEN_SECRET` | Refresh token secret |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration |
| `MERCHANT` | Zibal merchant identifier |
| `CALLBACK_URL` | Payment callback URL |
| `VERIFY_URL` | Payment verification endpoint |

## Authentication & Authorization

Authentication is implemented using Passport and JWT.

After registering and logging in, protected endpoints require an access token in the request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The application uses role-based authorization to restrict administrative operations.

### User Registration

Regular users can create an account through:

```http
POST /auth/register
```

Registration assigns the `USER` role automatically.

### Admin Account Setup

The admin creation endpoint is protected, so the first administrator must be created manually.

After registering a regular account, update its role directly in the database:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE mobile = 'YOUR_MOBILE_NUMBER';
```

Once an administrator exists, additional admin accounts can be created through:

```http
POST /users/admin
```

This endpoint is restricted to administrators.

## API Overview

The following table summarizes the main API modules and their responsibilities.

| Module | Description |
|---|---|
| Auth | User registration and login |
| Users | User information and account management |
| Products | Product management |
| Category | Product category management |
| Address | User address management |
| Basket | Shopping basket operations |
| Bookmarks | Saved products |
| Tickets | User support tickets |
| Discount Code | Discount creation and validation |
| Orders | Order creation, retrieval, and cancellation |
| Payment | Payment requests and verification |

### Access Control

The API uses authentication and role-based authorization to protect resources.

| Module | Access |
|---|---|
| Auth | Public |
| Users | Authenticated users / Admin |
| Products | Public read / Admin management |
| Category | Admin |
| Address | Authenticated users |
| Basket | Authenticated users |
| Bookmarks | Authenticated users |
| Tickets | Authenticated users |
| Discount Code | Authenticated validation / Admin management |
| Orders | Authenticated users / Admin |
| Payment | Authenticated payment requests |

## Order & Payment Flow

The order module handles the main purchasing process.

When a user creates an order, the application checks the user's basket, address, product availability, and discount code before creating the order.

The order process includes:

1. Checking the user's pending orders.
2. Validating the selected address.
3. Checking basket contents.
4. Verifying product stock.
5. Validating the discount code, if provided.
6. Creating the order and its items.
7. Updating product stock.
8. Clearing the user's basket.

Users can cancel pending orders. When an eligible order is canceled, the related product stock and discount usage are restored.

The payment module integrates with **Zibal** and handles payment requests and verification through the configured callback endpoint.

## Postman Collection

A Postman collection is included in the repository for testing the API endpoints.

```text
postman/Bazaarly-store.postman_collection.json
```

Import the collection into Postman and configure the required environment variables and authentication token before testing protected endpoints.

## Available Scripts

```bash
# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod

# Build the project
npm run build
```

## Author

**Benyamin Haghighi**

GitHub: [benyamin-haghighy](https://github.com/benyamin-haghighy)

## Contact

- **GitHub:** [benyamin-haghighy](https://github.com/benyamin-haghighy)
- **Email:** [bngh2003@gmail.com](mailto:bngh2003@gmail.com)