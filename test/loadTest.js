const autocannon = require("autocannon");

/**
 * Load test configuration options
 */
const defaultOptions = {
  connections: 10, // Number of concurrent connections
  pipelining: 1, // Number of pipelined requests
  duration: 10, // Duration in seconds
  timeout: 30, // Request timeout in seconds
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Test a URL endpoint with autocannon
 * @param {string} url - The URL to test
 * @param {Object} options - Test configuration options
 * @param {number} options.connections - Number of concurrent connections (default: 10)
 * @param {number} options.duration - Test duration in seconds (default: 10)
 * @param {number} options.pipelining - Number of pipelined requests (default: 1)
 * @param {Object} options.headers - Request headers (default: {'Content-Type': 'application/json'})
 * @param {string} options.method - HTTP method (default: 'GET')
 * @param {Object|string} options.body - Request body for POST/PUT requests
 * @param {string} options.token - Bearer token for authenticated requests
 * @returns {Promise<Object>} Test results
 */
async function testEndpoint(url, options = {}) {
  const config = { ...defaultOptions, ...options };

  // Add Authorization header if token is provided
  if (options.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${options.token}`,
    };
  }

  // Add body if provided
  if (options.body) {
    if (typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }
  }

  // Set HTTP method
  if (options.method) {
    config.method = options.method;
  }

  console.log(`🚀 Starting load test for: ${url}`);
  console.log(`📊 Test Configuration:`, {
    connections: config.connections,
    duration: config.duration,
    method: config.method || "GET",
    pipelining: config.pipelining,
  });

  try {
    const result = await autocannon({
      url,
      ...config,
    });

    // Display results in table format
    displayResultsTable(result, url);

    return result;
  } catch (error) {
    console.error(`❌ Load test failed for ${url}:`, error.message);
    throw error;
  }
}

/**
 * Format and display results in table format
 * @param {Object} result - Test result from autocannon
 * @param {string} url - The tested URL
 */
function displayResultsTable(result, url) {
  const successRate =
    ((result.requests.total - result.errors) / result.requests.total) * 100;
  const throughputMB = result.throughput.average / 1024 / 1024;

  console.log(`\n✅ Load Test Results for ${url}:`);
  console.log(`┌─────────────────────────────┬─────────────────────────────┐`);
  console.log(`│ Metric                      │ Value                       │`);
  console.log(`├─────────────────────────────┼─────────────────────────────┤`);
  console.log(
    `│ Requests per second         │ ${result.requests.average
      .toFixed(2)
      .padEnd(27)} │`
  );
  console.log(
    `│ Total requests              │ ${result.requests.total
      .toString()
      .padEnd(27)} │`
  );
  console.log(
    `│ Average latency             │ ${result.latency.average.toFixed(
      2
    )}ms${" ".repeat(23 - result.latency.average.toFixed(2).length)} │`
  );
  console.log(
    `│ Max latency                 │ ${result.latency.max.toFixed(
      2
    )}ms${" ".repeat(23 - result.latency.max.toFixed(2).length)} │`
  );
  console.log(
    `│ Min latency                 │ ${result.latency.min.toFixed(
      2
    )}ms${" ".repeat(23 - result.latency.min.toFixed(2).length)} │`
  );
  console.log(
    `│ Average throughput          │ ${throughputMB.toFixed(
      2
    )} MB/s${" ".repeat(19 - throughputMB.toFixed(2).length)} │`
  );
  console.log(
    `│ Success rate                │ ${successRate.toFixed(2)}%${" ".repeat(
      24 - successRate.toFixed(2).length
    )} │`
  );
  console.log(
    `│ Errors                      │ ${result.errors.toString().padEnd(27)} │`
  );
  console.log(
    `│ Test duration               │ ${result.duration}s${" ".repeat(
      25 - result.duration.toString().length
    )} │`
  );
  console.log(
    `│ Connections                 │ ${result.connections
      .toString()
      .padEnd(27)} │`
  );
  console.log(
    `│ Pipelining                  │ ${result.pipelining
      .toString()
      .padEnd(27)} │`
  );
  console.log(
    `└─────────────────────────────┴─────────────────────────────┘\n`
  );

  // Performance evaluation
  console.log(`📊 Performance Evaluation:`);
  console.log(`┌─────────────────────────────┬─────────────────────────────┐`);
  console.log(`│ Metric                      │ Rating                      │`);
  console.log(`├─────────────────────────────┼─────────────────────────────┤`);

  const rpsRating =
    result.requests.average > 1000
      ? "🟢 Excellent"
      : result.requests.average > 500
      ? "🟡 Good"
      : "🔴 Needs improvement";
  const latencyRating =
    result.latency.average < 50
      ? "🟢 Excellent"
      : result.latency.average < 200
      ? "🟡 Good"
      : "🔴 Needs improvement";
  const successRating =
    successRate === 100
      ? "🟢 Perfect"
      : successRate > 98
      ? "🟡 Good"
      : "🔴 Poor";

  console.log(`│ Requests/sec                │ ${rpsRating.padEnd(27)} │`);
  console.log(`│ Latency                     │ ${latencyRating.padEnd(27)} │`);
  console.log(`│ Reliability                 │ ${successRating.padEnd(27)} │`);
  console.log(
    `└─────────────────────────────┴─────────────────────────────┘\n`
  );
}

/**
 * Display multiple test results in comparison table
 * @param {Array} results - Array of test results
 */
function displayComparisonTable(results) {
  console.log(`\n📋 Test Results Comparison:`);
  console.log(
    `┌─────────────────────────────┬─────────────┬─────────────┬─────────────┬─────────────┐`
  );
  console.log(
    `│ Endpoint                    │ Req/sec     │ Avg Latency │ Success %   │ Errors      │`
  );
  console.log(
    `├─────────────────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤`
  );

  results.forEach((test) => {
    if (test.success) {
      const name =
        test.name.length > 27 ? test.name.substring(0, 24) + "..." : test.name;
      const rps = test.result.requests.average.toFixed(1);
      const latency = test.result.latency.average.toFixed(1) + "ms";
      const successRate =
        (
          ((test.result.requests.total - test.result.errors) /
            test.result.requests.total) *
          100
        ).toFixed(1) + "%";
      const errors = test.result.errors.toString();

      console.log(
        `│ ${name.padEnd(27)} │ ${rps.padEnd(11)} │ ${latency.padEnd(
          11
        )} │ ${successRate.padEnd(11)} │ ${errors.padEnd(11)} │`
      );
    } else {
      const name =
        test.name.length > 27 ? test.name.substring(0, 24) + "..." : test.name;
      console.log(
        `│ ${name.padEnd(27)} │ ${"FAILED".padEnd(11)} │ ${"FAILED".padEnd(
          11
        )} │ ${"FAILED".padEnd(11)} │ ${"FAILED".padEnd(11)} │`
      );
    }
  });

  console.log(
    `└─────────────────────────────┴─────────────┴─────────────┴─────────────┴─────────────┘\n`
  );
}

/**
 * Test multiple endpoints sequentially
 * @param {Array} endpoints - Array of endpoint configurations
 * @param {Object} globalOptions - Global options to apply to all tests
 * @returns {Promise<Array>} Array of test results
 */
async function testMultipleEndpoints(endpoints, globalOptions = {}) {
  const results = [];

  console.log(`🧪 Running load tests for ${endpoints.length} endpoints...\n`);

  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    const config = { ...globalOptions, ...endpoint.options };

    console.log(
      `[${i + 1}/${endpoints.length}] Testing: ${endpoint.name || endpoint.url}`
    );

    try {
      const result = await testEndpoint(endpoint.url, config);
      results.push({
        name: endpoint.name || endpoint.url,
        url: endpoint.url,
        result,
        success: true,
      });
    } catch (error) {
      results.push({
        name: endpoint.name || endpoint.url,
        url: endpoint.url,
        error: error.message,
        success: false,
      });
    }

    // Wait a bit between tests to avoid overwhelming the server
    if (i < endpoints.length - 1) {
      console.log("⏳ Waiting 2 seconds before next test...\n");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Display comparison table
  displayComparisonTable(results);

  return results;
}

/**
 * Quick test with default settings
 * @param {string} url - The URL to test
 * @returns {Promise<Object>} Test results
 */
async function quickTest(url) {
  return testEndpoint(url, {
    connections: 5,
    duration: 5,
  });
}

/**
 * Stress test with high load
 * @param {string} url - The URL to test
 * @returns {Promise<Object>} Test results
 */
async function stressTest(url) {
  return testEndpoint(url, {
    connections: 50,
    duration: 30,
    pipelining: 5,
  });
}

/**
 * Test authenticated endpoint
 * @param {string} url - The URL to test
 * @param {string} token - Bearer token
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Test results
 */
async function testAuthenticatedEndpoint(url, token, options = {}) {
  return testEndpoint(url, {
    ...options,
    token,
  });
}

/**
 * Export results to CSV format
 * @param {Object} result - Test result from autocannon
 * @param {string} url - The tested URL
 * @param {string} filename - Optional filename for CSV export
 */
function exportToCSV(result, url, filename) {
  const successRate =
    ((result.requests.total - result.errors) / result.requests.total) * 100;
  const throughputMB = result.throughput.average / 1024 / 1024;

  const csvHeader =
    "URL,Requests_per_second,Total_requests,Avg_latency_ms,Max_latency_ms,Min_latency_ms,Throughput_MB_s,Success_rate_percent,Errors,Duration_s,Connections,Pipelining\n";
  const csvData = `"${url}",${result.requests.average.toFixed(2)},${
    result.requests.total
  },${result.latency.average.toFixed(2)},${result.latency.max.toFixed(
    2
  )},${result.latency.min.toFixed(2)},${throughputMB.toFixed(
    2
  )},${successRate.toFixed(2)},${result.errors},${result.duration},${
    result.connections
  },${result.pipelining}\n`;

  if (filename) {
    const fs = require("fs");
    const fullData = csvHeader + csvData;
    fs.writeFileSync(filename, fullData);
    console.log(`📄 Results exported to ${filename}`);
  } else {
    console.log("\n📊 CSV Format Results:");
    console.log(csvHeader + csvData);
  }
}

/**
 * Display results in JSON format
 * @param {Object} result - Test result from autocannon
 * @param {string} url - The tested URL
 */
function displayResultsJSON(result, url) {
  const successRate =
    ((result.requests.total - result.errors) / result.requests.total) * 100;
  const throughputMB = result.throughput.average / 1024 / 1024;

  const formattedResult = {
    url: url,
    timestamp: new Date().toISOString(),
    metrics: {
      requestsPerSecond: parseFloat(result.requests.average.toFixed(2)),
      totalRequests: result.requests.total,
      latency: {
        average: parseFloat(result.latency.average.toFixed(2)),
        max: parseFloat(result.latency.max.toFixed(2)),
        min: parseFloat(result.latency.min.toFixed(2)),
      },
      throughputMB: parseFloat(throughputMB.toFixed(2)),
      successRate: parseFloat(successRate.toFixed(2)),
      errors: result.errors,
      duration: result.duration,
      connections: result.connections,
      pipelining: result.pipelining,
    },
  };

  console.log("\n📊 JSON Format Results:");
  console.log(JSON.stringify(formattedResult, null, 2));
  console.log("");
}

module.exports = {
  testEndpoint,
  testMultipleEndpoints,
  quickTest,
  stressTest,
  testAuthenticatedEndpoint,
  exportToCSV,
  displayResultsJSON,
};
