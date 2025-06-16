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

### Redis Server

#### Running Redis via Docker

Make sure Docker is running. Then:

```bash
docker run --name redis-server -p 6379:6379 -d redis
```

To stop:

```bash
docker stop redis-server
```

To restart:

```bash
docker start redis-server
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

## 🧪 Performance Testing

### ✅ Rate Limit Test (using k6)

This project uses k6 to simulate high traffic and verify that rate limiting is enforced correctly (100 requests per second per user).

- Simulates 200 virtual users sending >100 requests/sec.
- Uses **Redis** to enforce a global limit of 100 requests/sec.

### 🛠️ Prerequisite:

Install k6 CLI globally:

```bash
choco install k6        # For Windows (using Chocolatey)
brew install k6         # For macOS (Homebrew)
```

### 🔁 How to Run the Rate Limit Test:

1. First, login to get your JWT token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

2. Copy the token from the response.

3. Run the test with your token (via CLI):

```bash
npm run test:rate-limit -- --env TOKEN=<PASTE_YOUR_JWT_HERE>
```

This runs k6 with:

- 200 Virtual Users
- 1-second duration
- JSON summary output at `tests/summary/rate-limit-summary.json`

### 📂 Output Example:

```
Summary stored at:
tests/summary/rate-limit-summary.json
```

### 📈 What to Expect:

- The rate limiter is working as expected, effectively limiting requests to 100 per second per user
- Initial requests will return `200 OK` while within the rate limit
- Once the limit is reached, subsequent requests will return `429 Too Many Requests`
- The distribution of successful vs rate-limited responses confirms the rate limiter is functioning correctly
- Run logs and exported summary show validation of the system under pressure and rate limiting behavior

### 🔥 Load Test

To run a comprehensive load test:

```bash
npm run test:load -- --env TOKEN=<PASTE_YOUR_JWT_HERE>
```

This will simulate a realistic load on your application, testing:
- Concurrent user handling
- Response times under load
- System stability and resource usage
- Error rates across different load levels

Make sure to replace `<PASTE_YOUR_JWT_HERE>` with a valid JWT token obtained from the authentication endpoint.
