# Temperature Dashboard

A real-time, high-performance temperature monitoring dashboard built with **React**, **Node.js**, **Express.js**, and **Highcharts**, designed to handle **millions of concurrent users** efficiently.

## 🌟 Core Features

- Real-time data visualization using Highcharts
- RESTful API with JWT-based authentication
- Scalable backend architecture (Node.js + Express)
- Frontend built with Vite, styled using TailwindCSS
- Rate-limiting (100 requests/sec per user)
- Designed for horizontal scalability (multi-core + proxy-friendly)
- Structured for future enhancements like clustering, caching, and load balancing

## 🚀 Running the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install -g pnpm
pnpm install
pnpm run dev
```

## 📚 API Documentation

### 🔐 Authentication

#### POST `/api/auth/login`

Authenticate a user and receive a JWT token.

- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "123456"
  }
  ```

- **Success Response**:
  ```json
  {
    "success": true,
    "token": "<JWT_TOKEN>"
  }
  ```

- **Failure Response** (Invalid or missing credentials):
  ```json
  {
    "success": false,
    "error": "Invalid credentials"
  }
  ```

### 🌡️ Get Temperature

#### GET `/api/temperature`

Returns current temperature data. JWT authentication required.

- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```

- **Success Response**:
  ```json
  {
    "temperature": 25,
    "unit": "Celsius",
    "timestamp": "2023-10-01T12:00:00Z"
  }
  ```

- **Failure Response** (Missing or invalid token):
  ```json
  {
    "success": false,
    "error": "Unauthorized"
  }
  ```
