# Microservices Load Testing Suite

This directory contains load testing tools for your microservices using [autocannon](https://github.com/mcollina/autocannon), a fast HTTP/1.1 benchmarking tool.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Command Line Interface](#command-line-interface)
- [Configuration Options](#configuration-options)
- [Quick Reference Tables](#quick-reference-tables)

## 🚀 Installation

The dependencies are already installed, but if you need to reinstall:

```bash
cd test
npm install
```

## ⚡ Quick Start

1. **Make sure your user service is running** on `http://localhost:8000`

2. **Run a quick test:**

   ```bash
   npm run test:quick
   ```

3. **Test a specific endpoint:**
   ```bash
   npm run test:endpoint http://localhost:8000/api/v1/users
   ```

## 📚 Usage Examples

### Test a GET Endpoint

```bash
node runner.js http://localhost:8000/api/v1/users
```

### Test a POST Endpoint (Login)

```bash
node runner.js http://localhost:8000/api/v1/auth/login --method POST --body '{"email":"test@example.com","password":"password123"}'
```

### Test an Authenticated Endpoint

```bash
node runner.js http://localhost:8000/api/v1/auth/me --token YOUR_JWT_TOKEN_HERE
```

### Custom Load Test

```bash
node runner.js http://localhost:8000/api/v1/users --connections 20 --duration 30
```

### Stress Test

```bash
node runner.js http://localhost:8000/api/v1/users --connections 100 --duration 60 --pipelining 10
```

## 🛠 Available Scripts

```bash
# Run example tests
npm test

# Quick performance check (5 connections, 5 seconds)
npm run test:quick

# Stress test (50 connections, 30 seconds)
npm run test:stress

# Test all user service endpoints
npm run test:all

# Test specific endpoint with custom options
npm run test:endpoint -- <url> [options]
```

## 📖 API Documentation

### Core Functions

#### `testEndpoint(url, options)`

Test a single endpoint with custom configuration.

**Parameters:**

- `url` (string): The endpoint URL to test
- `options` (object): Test configuration options

**Example:**

```javascript
const { testEndpoint } = require("./loadTest");

await testEndpoint("http://localhost:8000/api/v1/users", {
  connections: 10,
  duration: 15,
  method: "GET",
});
```

#### `testMultipleEndpoints(endpoints, globalOptions)`

Test multiple endpoints sequentially.

**Example:**

```javascript
const { testMultipleEndpoints } = require("./loadTest");

const endpoints = [
  {
    name: "Get Users",
    url: "http://localhost:8000/api/v1/users",
    options: { method: "GET", connections: 10 },
  },
  {
    name: "Login",
    url: "http://localhost:8000/api/v1/auth/login",
    options: {
      method: "POST",
      body: { email: "test@example.com", password: "password123" },
      connections: 5,
    },
  },
];

await testMultipleEndpoints(endpoints);
```

#### `quickTest(url)`

Run a quick test with minimal load (5 connections, 5 seconds).

#### `stressTest(url)`

Run a stress test with high load (50 connections, 30 seconds).

#### `testAuthenticatedEndpoint(url, token, options)`

Test an endpoint that requires authentication.

**Example:**

```javascript
await testAuthenticatedEndpoint(
  "http://localhost:8000/api/v1/auth/me",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  { connections: 10, duration: 10 }
);
```

## 🖥 Command Line Interface

The `runner.js` script provides a CLI for testing endpoints:

```bash
node runner.js <url> [options]
```

### CLI Options

| Option                 | Description                | Default |
| ---------------------- | -------------------------- | ------- |
| `--method <method>`    | HTTP method                | GET     |
| `--connections <num>`  | Concurrent connections     | 10      |
| `--duration <seconds>` | Test duration              | 10      |
| `--pipelining <num>`   | Pipelined requests         | 1       |
| `--body <json>`        | Request body (JSON string) | -       |
| `--token <token>`      | Bearer token               | -       |
| `--timeout <seconds>`  | Request timeout            | 30      |
| `--help, -h`           | Show help                  | -       |

### CLI Examples

```bash
# Basic GET test
node runner.js http://localhost:8000/api/v1/users

# POST with body
node runner.js http://localhost:8000/api/v1/users \
  --method POST \
  --body '{"username":"test","email":"test@example.com","password":"password123","name":"Test User"}'

# Authenticated request
node runner.js http://localhost:8000/api/v1/auth/me \
  --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Custom load test
node runner.js http://localhost:8000/api/v1/users \
  --connections 25 \
  --duration 20 \
  --pipelining 2
```

## ⚙️ Configuration Options

### Default Configuration

```javascript
{
  connections: 10,     // Number of concurrent connections
  pipelining: 1,       // Number of pipelined requests
  duration: 10,        // Duration in seconds
  timeout: 30,         // Request timeout in seconds
  headers: {
    'Content-Type': 'application/json'
  }
}
```

### Available Options

| Option        | Type          | Description                                 |
| ------------- | ------------- | ------------------------------------------- |
| `connections` | number        | Number of concurrent connections            |
| `duration`    | number        | Test duration in seconds                    |
| `pipelining`  | number        | Number of pipelined requests per connection |
| `method`      | string        | HTTP method (GET, POST, PUT, DELETE, etc.)  |
| `headers`     | object        | Custom headers                              |
| `body`        | object/string | Request body                                |
| `token`       | string        | Bearer token for Authorization header       |
| `timeout`     | number        | Request timeout in seconds                  |

## 📊 Understanding Results

The load test results include:

- **Requests per second**: Average throughput
- **Total requests**: Total number of requests sent
- **Average latency**: Average response time in milliseconds
- **Max latency**: Maximum response time encountered
- **Average throughput**: Data transfer rate in MB/s
- **Success rate**: Percentage of successful requests
- **Errors**: Number of failed requests
- **Test duration**: Actual test duration

### Example Output

```
✅ Load Test Results for http://localhost:8000/api/v1/users:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Requests per second: 1250.45
📊 Total requests: 12504
⚡ Average latency: 7.85ms
🔥 Max latency: 45.23ms
📦 Average throughput: 2.34 MB/s
🎯 Success rate: 100.00%
❌ Errors: 0
🕐 Test duration: 10s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎯 Testing Scenarios

### Performance Testing

```bash
# Light load
node runner.js http://localhost:8000/api/v1/users --connections 5 --duration 10

# Medium load
node runner.js http://localhost:8000/api/v1/users --connections 25 --duration 30

# Heavy load
node runner.js http://localhost:8000/api/v1/users --connections 100 --duration 60
```

### User Service Endpoints

1. **Registration Load Test**

   ```bash
   node runner.js http://localhost:8000/api/v1/users \
     --method POST \
     --body '{"username":"loadtest","email":"loadtest@example.com","password":"password123","name":"Load Test"}' \
     --connections 5 \
     --duration 10
   ```

2. **Login Load Test**

   ```bash
   node runner.js http://localhost:8000/api/v1/auth/login \
     --method POST \
     --body '{"email":"test@example.com","password":"password123"}' \
     --connections 10 \
     --duration 15
   ```

3. **Get Users Load Test**
   ```bash
   node runner.js http://localhost:8000/api/v1/users \
     --connections 20 \
     --duration 30
   ```

## 🔧 Programmatic Usage

You can also use the testing functions programmatically in your own scripts:

```javascript
const { testEndpoint, testMultipleEndpoints } = require("./loadTest");

async function customTests() {
  // Test single endpoint
  const result1 = await testEndpoint("http://localhost:8000/api/v1/users", {
    connections: 15,
    duration: 20,
  });

  // Test multiple endpoints
  const endpoints = [
    { url: "http://localhost:8000/api/v1/users", options: { method: "GET" } },
    {
      url: "http://localhost:8000/api/v1/users/search?q=test",
      options: { method: "GET" },
    },
  ];

  const results = await testMultipleEndpoints(endpoints);

  return { result1, results };
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Refused**

   - Make sure your service is running on the specified port
   - Check if the URL is correct

2. **High Error Rate**

   - Reduce the number of connections
   - Increase the timeout value
   - Check server logs for errors

3. **Low Performance**
   - Check server resources (CPU, memory)
   - Monitor database connections
   - Review application bottlenecks

### Tips for Better Results

- Start with low connections and gradually increase
- Monitor server resources during testing
- Test different endpoints separately
- Use realistic test data
- Consider database state and caching effects

## 📄 License

This testing suite is part of the microservices project and follows the same license.

## 📊 Quick Reference Tables

### Available Test Functions

| Function                                          | Purpose                              | Default Settings                  | Usage Example                                           |
| ------------------------------------------------- | ------------------------------------ | --------------------------------- | ------------------------------------------------------- |
| `testEndpoint(url, options)`                      | Test single endpoint                 | 10 conn, 10s duration             | `testEndpoint('http://localhost:8000/api/v1/users')`    |
| `testMultipleEndpoints(endpoints, globalOptions)` | Test multiple endpoints sequentially | Varies per endpoint               | `testMultipleEndpoints([{url: '...', options: {...}}])` |
| `quickTest(url)`                                  | Quick performance check              | 5 conn, 5s duration               | `quickTest('http://localhost:8000/api/v1/users')`       |
| `stressTest(url)`                                 | High load stress test                | 50 conn, 30s duration, 5 pipeline | `stressTest('http://localhost:8000/api/v1/users')`      |
| `testAuthenticatedEndpoint(url, token, options)`  | Test protected endpoints             | 10 conn, 10s duration             | `testAuthenticatedEndpoint(url, 'jwt_token', {})`       |

### NPM Scripts Quick Reference

| Script                  | Command                         | Description                |
| ----------------------- | ------------------------------- | -------------------------- |
| `npm test`              | `node examples.js`              | Run example tests          |
| `npm run test:quick`    | Quick performance check         | 5 connections, 5 seconds   |
| `npm run test:stress`   | Stress test                     | 50 connections, 30 seconds |
| `npm run test:all`      | Test all user service endpoints | Multiple endpoint testing  |
| `npm run test:endpoint` | `node runner.js <url>`          | Test specific endpoint     |

### Load Testing Scenarios

| Scenario        | Connections | Duration | Pipelining | Use Case                    |
| --------------- | ----------- | -------- | ---------- | --------------------------- |
| **Light Load**  | 5-10        | 5-10s    | 1          | Basic functionality testing |
| **Medium Load** | 15-25       | 15-30s   | 1-2        | Normal traffic simulation   |
| **Heavy Load**  | 50-100      | 30-60s   | 2-5        | Peak traffic testing        |
| **Stress Test** | 100+        | 60s+     | 5-10       | Breaking point analysis     |

### User Service Endpoints Testing Guide

| Endpoint                        | Method | Authentication | Body Required | Test Command                                                                                                    |
| ------------------------------- | ------ | -------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| `/api/v1/users`                 | GET    | ❌             | ❌            | `node runner.js http://localhost:8000/api/v1/users`                                                             |
| `/api/v1/users`                 | POST   | ❌             | ✅            | `node runner.js http://localhost:8000/api/v1/users --method POST --body '{...}'`                                |
| `/api/v1/users/:id`             | GET    | ❌             | ❌            | `node runner.js http://localhost:8000/api/v1/users/USER_ID`                                                     |
| `/api/v1/users/:id`             | PATCH  | ✅             | ✅            | `node runner.js http://localhost:8000/api/v1/users/USER_ID --method PATCH --token TOKEN`                        |
| `/api/v1/users/:id`             | DELETE | ✅             | ❌            | `node runner.js http://localhost:8000/api/v1/users/USER_ID --method DELETE --token TOKEN`                       |
| `/api/v1/users/search`          | GET    | ❌             | ❌            | `node runner.js http://localhost:8000/api/v1/users/search?q=test`                                               |
| `/api/v1/users/change-password` | PATCH  | ✅             | ✅            | `node runner.js http://localhost:8000/api/v1/users/change-password --method PATCH --token TOKEN --body '{...}'` |
| `/api/v1/auth/login`            | POST   | ❌             | ✅            | `node runner.js http://localhost:8000/api/v1/auth/login --method POST --body '{...}'`                           |
| `/api/v1/auth/me`               | GET    | ✅             | ❌            | `node runner.js http://localhost:8000/api/v1/auth/me --token TOKEN`                                             |
| `/api/v1/auth/refresh-token`    | POST   | ❌             | ✅            | `node runner.js http://localhost:8000/api/v1/auth/refresh-token --method POST --body '{...}'`                   |
| `/api/v1/auth/logout`           | POST   | ✅             | ❌            | `node runner.js http://localhost:8000/api/v1/auth/logout --method POST --token TOKEN`                           |
| `/api/v1/auth/forgot-password`  | POST   | ❌             | ✅            | `node runner.js http://localhost:8000/api/v1/auth/forgot-password --method POST --body '{...}'`                 |
| `/api/v1/auth/reset-password`   | POST   | ❌             | ✅            | `node runner.js http://localhost:8000/api/v1/auth/reset-password --method POST --body '{...}'`                  |

### Performance Benchmarks

| Metric              | Good  | Average  | Poor   | Action Required          |
| ------------------- | ----- | -------- | ------ | ------------------------ |
| **Requests/sec**    | >1000 | 500-1000 | <500   | Optimize server/database |
| **Average Latency** | <50ms | 50-200ms | >200ms | Check bottlenecks        |
| **Success Rate**    | 100%  | 98-99%   | <98%   | Fix errors               |
| **Error Rate**      | 0%    | <2%      | >2%    | Debug issues             |
