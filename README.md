# Bazaarly

A REST API for an online store, built with NestJS, TypeORM and MySQL.  
It covers the full shop flow: accounts & roles, product catalogue, basket, bookmarks, support tickets, discount codes, orders and online payment through Zibal.

This is a learning project that tries to behave like a real backend — stock reservation, order cancellation and payment verification are implemented (not just stubbed).

## Features

- **Auth**: Register and login with mobile number + password. Returns access token + refresh token (JWT).
- **Roles**: `USER` and `ADMIN`. Catalogue management and discount codes are admin-only.
- **Catalogue**: Products and categories (many-to-many).
- **Addresses**: Each user manages their own delivery addresses.
- **Basket**: One row per product with quantity.
- **Bookmarks**: Save products for later.
- **Support tickets**: Tickets can have replies; users only see their own.
- **Discount codes**: Server-generated, percentage-based, with expiry time and usage limit.
- **Orders**: Checkout from basket. Stock is reserved on order creation and restored on cancellation.
- **Payments**: Start payment with Zibal and verify on callback.

## Screenshots

| Login | Register | Products |
|:---:|:---:|:---:|
| ![Login](./screenshots/login.png) | ![Register](./screenshots/register.png) | ![Products](./screenshots/products.png) |

## Tech stack

| Area              | Choice                          |
|-------------------|---------------------------------|
| Framework         | NestJS (TypeScript)             |
| Database          | MySQL + TypeORM                 |
| Auth              | Passport (JWT strategy), bcrypt |
| Validation        | class-validator, class-transformer |
| HTTP client       | axios (for Zibal)               |
| Linting           | oxlint                          |
| Tests             | Jest + Postman collection       |

Exact versions are in `package.json`.

## Getting started

You need **Node.js 22+** (developed on 24) and a running MySQL server.

```bash
git clone https://github.com/benyamin-haghighy/bazaarly-api.git
cd bazaarly-api
npm install
```

Create the database (TypeORM creates tables on startup with `synchronize: true`, but not the database itself):

```sql
CREATE DATABASE shop;
```

Copy the example environment file and fill it in:

```bash
cp .env.example .env
```

Start the server:

```bash
npm run start:dev
```

The API listens on `http://localhost:3000`.

## Environment variables

| Variable                      | Description |
|-------------------------------|-------------|
| `PORT`                        | Port to listen on (default: `3000`) |
| `DB_HOST`, `DB_PORT`          | MySQL host and port |
| `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | Database name and credentials |
| `ACCESS_TOKEN_SECRETE_KEY`    | Secret for access tokens (**spelling matches the code**) |
| `ACCESS_TOKEN_EXPIRE`         | Access token lifetime (e.g. `1h`) |
| `REFRESH_TOKEN_SECRET`        | Secret for refresh tokens |
| `REFRESH_TOKEN_EXPIRES_IN`    | Refresh token lifetime (e.g. `7d`) |
| `MERCHANT`                    | Zibal merchant ID (`zibal` is the test merchant) |
| `CALLBACK_URL`                | URL Zibal redirects to after payment (must point to `GET /payment/verify`) |
| `VERIFY_URL`                  | Zibal verify endpoint |

Use long random strings for both JWT secrets outside local development.

## Scripts

| Command              | Description                     |
|----------------------|---------------------------------|
| `npm run start:dev`  | Run with file watching          |
| `npm run build`      | Compile to `dist/`              |
| `npm run start:prod` | Run the compiled build          |
| `npm run lint`       | Lint `src/` and `test/`         |
| `npm test`           | Run Jest tests                  |

## Project structure

```
src/
  auth/           register, login, JWT strategy
  users/          user entity and user endpoints
  address/        delivery addresses
  category/       categories + admin strategy
  products/       products
  basket/         basket items
  bookmarks/      saved products
  tickets/        support tickets and replies
  discount-code/  discount codes
  orders/         orders and order items
  payment/        Zibal payment and callback
  main.ts
  app.module.ts
```

Each folder is a Nest module with its own controller, service, DTOs and entities.

## API overview

Protected routes expect `Authorization: Bearer <accessToken>`.  
“Admin” means the token belongs to a user with the `ADMIN` role.

| Area            | Endpoints                                                                 | Access      |
|-----------------|---------------------------------------------------------------------------|-------------|
| Auth            | `POST /auth/register`, `GET /auth/login`                                  | Public      |
| Users           | `POST /users`                                                             | Public      |
|                 | `GET /users`, `GET /users/role/:role`                                     | Admin       |
|                 | `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`                 | Authenticated |
| Categories      | `POST /category`, `GET /category`, `GET /category/:id`, `PATCH /category/:id`, `DELETE /category/:id` | Admin |
| Products        | `GET /products`, `GET /products/:id`                                      | Public      |
|                 | `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`           | Admin       |
| Addresses       | `POST /address`, `GET /address`, `GET /address/:id`, `PATCH /address/:id`, `DELETE /address/:id` | User |
| Basket          | `POST /basket`, `GET /basket`, `PATCH /basket/:id`, `DELETE /basket/:id`  | User        |
| Bookmarks       | `POST /bookmarks`, `GET /bookmarks`, `DELETE /bookmarks/:id`              | User        |
| Tickets         | `POST /tickets`, `GET /tickets`, `GET /tickets/:id`, `PATCH /tickets/:id`, `DELETE /tickets/:id` | User |
| Discount codes  | `POST /discount-codes/validate`                                           | User        |
|                 | `POST /discount-codes`, `GET /discount-codes`                             | Admin       |
| Orders          | `POST /orders`, `GET /orders/status/:status?`, `GET /orders/:id`, `PATCH /orders/:id/cancel`, `DELETE /orders/:id` | User |
|                 | `PATCH /orders/:id` (change status)                                       | Admin       |
| Payment         | `POST /payment`                                                           | User        |
|                 | `GET /payment/verify` (Zibal callback)                                    | Public      |

### Important notes

- Login is currently a **GET** request that reads `mobile` and `password` from the JSON body.
- Basket `PATCH` **adds** the given quantity to the existing one (it does not replace it).
- `GET /orders/status` returns all orders of the user. Append `/PENDING`, `/PAID` or `/CANCELED` to filter.
- Response format is not fully consistent yet. Some modules return `{ statusCode, data, message }`, others return the entity directly.
- The product description field is spelled `descryption` in both the API and the database.

### Examples

**Register**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Sara", "mobile": "09123456789", "password": "Passw0rd123"}'
```

**Login**
```bash
curl -X GET http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile": "09123456789", "password": "Passw0rd123"}'
```

**Add to basket**
```bash
curl -X POST http://localhost:3000/basket \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'
```

**Place an order with discount code**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"address_id": 1, "discount_code_text": "A3F9C21B"}'
```

## How checkout and payment work

1. User fills the basket (`POST /basket`).
2. `POST /orders` checks that the basket is not empty and that enough stock exists for every item.  
   It calculates the total, applies the discount code (if provided), creates the order as `PENDING`, stores the unit price of each item, reduces stock, marks the code as used and clears the basket.
3. A user can have only **one** `PENDING` order at a time.
4. `PATCH /orders/:id/cancel` cancels a `PENDING` order, restores stock and releases the discount code.
5. `POST /payment` requests a payment session from Zibal and returns a `payment_url`. The user pays on that page.
6. Zibal redirects the browser to `CALLBACK_URL` (`GET /payment/verify`) with `success` and `trackId`.  
   The server does **not** trust these values — it calls Zibal’s verify endpoint, then marks the payment as `SUCCESS` and the order as `PAID`. On failure/cancellation the payment becomes `FAILED` and the order is cancelled.

> Zibal expects amounts in **rials**. Store prices in rials or convert before sending.

Discount codes are created by an admin with `percent`, `valid_for_minutes` and an optional `usage_limit` (default `1`). The server generates the actual code string.

## Testing the API

The Postman collection is located at:

```
postman/Bazaarly-store.postman_collection.json
```

It walks through the whole flow: sign-up, admin setup, catalogue, basket, bookmarks, tickets, discount codes, checkout, payment and cleanup.

1. Start the server and make sure the database is reachable.
2. Import the collection into Postman.
3. Open Collection Runner → select the collection → set iterations to 1 → Run.

Tokens and IDs are stored in collection variables automatically. Each run creates users with random mobile numbers, so you can run it repeatedly against the same database. The base URL is controlled by the `baseUrl` collection variable.

The payment folder needs internet access and a valid `MERCHANT`. The collection simulates a cancelled payment via the callback. To test a successful payment, create an order, call `POST /payment`, open the returned `payment_url` in a browser and complete Zibal’s test payment.

Jest is configured, but the current spec files are still the generated defaults.

## Known issues

- `POST /users` is public and accepts a `role` field → anyone can create an admin account.
- `GET /users` and `GET /users/:id` still return the password hash.
- `PATCH /products/:id` only saves when `categories` is sent with at least one id (misplaced braces in the service).
- Order creation is **not** wrapped in a database transaction. Stock check and stock update are separate steps → concurrent orders can oversell a product.
- A refresh token is issued at login, but there is currently **no** endpoint that uses it.
- Login should ideally be a `POST` request.
- `synchronize: true` is enabled. Switch to migrations before any real deployment.
- Some response messages and error texts are in Persian / mixed language.

## Author

Benyamin ([@benyamin-haghighy](https://github.com/benyamin-haghighy))
```