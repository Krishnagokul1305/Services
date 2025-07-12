const {
  testEndpoint,
  testMultipleEndpoints,
  quickTest,
  stressTest,
  testAuthenticatedEndpoint,
} = require("./loadTest");

// Base URL for your API services
const USER_SERVICE_URL = "http://localhost:8000/api/v1";

/**
 * Example: Test a single endpoint
 */
async function testSingleEndpoint() {
  console.log("🧪 Testing single endpoint...\n");

  try {
    await testEndpoint(`${USER_SERVICE_URL}/users`, {
      connections: 10,
      duration: 15,
      method: "GET",
    });
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

/**
 * Example: Test user registration endpoint
 */
async function testUserRegistration() {
  console.log("🧪 Testing user registration endpoint...\n");

  const testData = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: "password123",
    name: "Test User",
  };

  try {
    await testEndpoint(`${USER_SERVICE_URL}/users`, {
      method: "POST",
      body: testData,
      connections: 5,
      duration: 10,
    });
  } catch (error) {
    console.error("Registration test failed:", error.message);
  }
}

/**
 * Example: Test login endpoint
 */
async function testLogin() {
  console.log("🧪 Testing login endpoint...\n");

  const loginData = {
    email: "test@example.com",
    password: "password123",
  };

  try {
    await testEndpoint(`${USER_SERVICE_URL}/auth/login`, {
      method: "POST",
      body: loginData,
      connections: 8,
      duration: 10,
    });
  } catch (error) {
    console.error("Login test failed:", error.message);
  }
}

/**
 * Example: Test authenticated endpoint
 */
async function testAuthenticatedEndpoints() {
  console.log("🧪 Testing authenticated endpoints...\n");

  // You need to replace this with a valid token
  const token = "your_jwt_token_here";

  try {
    await testAuthenticatedEndpoint(`${USER_SERVICE_URL}/auth/me`, token, {
      connections: 10,
      duration: 10,
    });
  } catch (error) {
    console.error("Authenticated test failed:", error.message);
  }
}

/**
 * Example: Test multiple endpoints
 */
async function testAllEndpoints() {
  console.log("🧪 Testing multiple endpoints...\n");

  const endpoints = [
    {
      name: "Get All Users",
      url: `${USER_SERVICE_URL}/users`,
      options: {
        method: "GET",
        connections: 10,
        duration: 8,
      },
    },
    {
      name: "Search Users",
      url: `${USER_SERVICE_URL}/users/search?q=test`,
      options: {
        method: "GET",
        connections: 8,
        duration: 8,
      },
    },
    {
      name: "User Registration",
      url: `${USER_SERVICE_URL}/users`,
      options: {
        method: "POST",
        body: {
          username: `loadtest_${Date.now()}`,
          email: `loadtest_${Date.now()}@example.com`,
          password: "password123",
          name: "Load Test User",
        },
        connections: 5,
        duration: 8,
      },
    },
    {
      name: "Login",
      url: `${USER_SERVICE_URL}/auth/login`,
      options: {
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
        connections: 8,
        duration: 8,
      },
    },
  ];

  try {
    await testMultipleEndpoints(endpoints, {
      timeout: 30,
    });
  } catch (error) {
    console.error("Multiple endpoint test failed:", error.message);
  }
}

/**
 * Example: Quick performance check
 */
async function quickPerformanceCheck() {
  console.log("⚡ Running quick performance check...\n");

  try {
    await quickTest(`${USER_SERVICE_URL}/users`);
  } catch (error) {
    console.error("Quick test failed:", error.message);
  }
}

/**
 * Example: Stress test
 */
async function runStressTest() {
  console.log("💪 Running stress test...\n");

  try {
    await stressTest(`${USER_SERVICE_URL}/users`);
  } catch (error) {
    console.error("Stress test failed:", error.message);
  }
}

/**
 * Custom test function for your specific needs
 * @param {string} url - The endpoint URL to test
 * @param {Object} options - Test configuration
 */
async function customTest(url, options = {}) {
  console.log(`🎯 Running custom test for: ${url}\n`);

  const defaultConfig = {
    connections: 10,
    duration: 10,
    method: "GET",
  };

  const config = { ...defaultConfig, ...options };

  try {
    const result = await testEndpoint(url, config);
    return result;
  } catch (error) {
    console.error("Custom test failed:", error.message);
    throw error;
  }
}

// Export functions for use in other files
module.exports = {
  testSingleEndpoint,
  testUserRegistration,
  testLogin,
  testAuthenticatedEndpoints,
  testAllEndpoints,
  quickPerformanceCheck,
  runStressTest,
  customTest,
};

// If this file is run directly, execute a demo
if (require.main === module) {
  console.log("🚀 Microservices Load Testing Demo\n");
  console.log(
    "Make sure your user service is running on http://localhost:8000\n"
  );

  (async () => {
    try {
      // Run a quick demo test
      await quickPerformanceCheck();

      // Uncomment the tests you want to run:
      // await testSingleEndpoint();
      // await testUserRegistration();
      // await testLogin();
      // await testAllEndpoints();
      // await runStressTest();
    } catch (error) {
      console.error("Demo failed:", error.message);
    }
  })();
}
