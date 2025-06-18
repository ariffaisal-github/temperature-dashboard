# Temperature Dashboard

A real-time, high-performance temperature monitoring dashboard built with **React**, **Node.js**, **Express.js**, and **Highcharts**, designed to handle **millions of concurrent users** efficiently.

## 🛠️ Setup and Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm and pnpm
- Docker and Docker Compose (for containerized deployment)
- Redis (for rate limiting and session management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ariffaisal-github/temperature-dashboard.git
   cd temperature-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Update the environment variables as needed


## 🌟 Core Features

- Real-time data visualization using Highcharts
- RESTful API with JWT-based authentication
- Scalable backend architecture (Node.js + Express)
- Frontend built with Vite, styled using TailwindCSS
- Rate-limiting (100 requests/sec per user)
- Designed for horizontal scalability (multi-core + proxy-friendly)
- Structured for future enhancements like clustering, caching, and load balancing

## 🚀 Usage

### Login

1. Open the application in your web browser
2. Use the following credentials to log in:
   - **Email:** test@example.com
   - **Password:** 123456

### Viewing Temperature Data

After logging in, you'll be automatically directed to the dashboard where you can:

- View real-time temperature data in an interactive graph
- See timestamps for each temperature reading
- Watch as new data points are added automatically

### Real-time Updates

The temperature graph is updated dynamically by fetching data from the `/api/temperature` endpoint at regular intervals. The graph will automatically update to show the latest temperature readings along with their timestamps.

## 🚀 Running the Project

### Using Docker Compose

To run the entire application stack using Docker Compose, ensure you have Docker and Docker Compose installed. Then, execute:

```bash
docker-compose up -d --build
```

This command builds the images and starts all containers in detached mode (backend, front-end replicas, nginx, and Redis). View logs with `docker-compose logs -f`. 

Access the web application at `http://localhost:8080`

For performance testing, see the [Performance Testing](#-performance-testing) section below.

## 🧩 Design Decisions

### Architecture
- **Frontend**: Built with React and Vite for fast development and hot module replacement
- **Backend**: Node.js with Express for handling API requests
- **Authentication**: JWT-based stateless authentication
- **Rate Limiting**: Redis-backed rate limiting (100 requests/second per user)
- **Real-time Updates**: Polling mechanism for temperature data updates

### Key Design Choices
1. **Modular Architecture**: Separated frontend and backend for better maintainability
2. **Containerization**: Docker support for consistent development and deployment
3. **Scalability**: Designed to handle high traffic with rate limiting and efficient data fetching
4. **Security**: JWT authentication, environment variables for sensitive data
5. **Testing**: Comprehensive test suite including unit, integration, and performance tests

## 📚 API Documentation

### Base URL
`http://localhost:8080/api`

### Authentication
All endpoints except `/api/auth/login` require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

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
The application includes comprehensive performance testing using k6 to ensure it can handle the expected load.

### Test Types
1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test the interaction between components
3. **Load Tests**: Simulate high traffic to test system performance
4. **Rate Limit Tests**: Verify rate limiting functionality

### ✅ Rate Limit Test (using k6)

This project uses k6 to simulate high traffic and verify that rate limiting is enforced correctly (100 requests per second per user).

- Simulates 200 virtual users sending >100 requests/sec.
- Uses **Redis** to enforce a global limit of 100 requests/sec.

*k6 is executed inside a Docker container, so you **do not** need the k6 CLI on your host machine. If you prefer local runs, install it via Homebrew/Chocolatey.*

### 🔁 How to Run the Rate-Limit Test (Docker)

```bash
cd backend
npm run tokens:generate   # ensure Redis has tokens
npm run tokens:export
npm run test:compose:rate-limit
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

### 🔥 Load Test (Docker)

```bash
cd backend
npm run tokens:generate
npm run tokens:export
npm run test:compose:load
```

This will simulate a realistic load on your application, testing:

- Concurrent user handling
- Response times under load
- System stability and resource usage
- Error rates across different load levels

### 📂 Output Example:

```
Summary stored at:
tests/summary/load-test-summary.json
```

### 📈 What to Expect:

- The system should handle the load without crashing
- Response times should remain within acceptable limits
- Error rates should be low, ideally below 1%
- The load test summary will provide insights into performance bottlenecks and areas for optimization
