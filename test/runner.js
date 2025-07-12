#!const { testEndpoint, exportToCSV, displayResultsJSON } = require('./loadTest');usr/bin/env node

const { testEndpoint } = require("./loadTest");

/**
 * Command line interface for testing endpoints
 * Usage: node runner.js <url> [options]
 *
 * Examples:
 * node runner.js http://localhost:8000/api/v1/users
 * node runner.js http://localhost:8000/api/v1/auth/login --method POST --body '{"email":"test@example.com","password":"password123"}'
 * node runner.js http://localhost:8000/api/v1/auth/me --token your_jwt_token
 */

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
🧪 Autocannon Load Testing Tool for Microservices

Usage: node runner.js <url> [options]

Options:
  --method <method>        HTTP method (default: GET)
  --connections <num>      Number of concurrent connections (default: 10)
  --duration <seconds>     Test duration in seconds (default: 10)
  --pipelining <num>       Number of pipelined requests (default: 1)
  --body <json>           Request body as JSON string
  --token <token>         Bearer token for authentication
  --timeout <seconds>     Request timeout (default: 30)
  --format <format>       Output format: table, json, csv (default: table)
  --export <filename>     Export results to CSV file
  --help, -h              Show this help message

Examples:
  # Test GET endpoint with table format (default)
  node runner.js http://localhost:8000/api/v1/users

  # Test with JSON output
  node runner.js http://localhost:8000/api/v1/users --format json

  # Test with CSV output
  node runner.js http://localhost:8000/api/v1/users --format csv

  # Export results to CSV file
  node runner.js http://localhost:8000/api/v1/users --export results.csv

  # Test POST endpoint with body
  node runner.js http://localhost:8000/api/v1/auth/login --method POST --body '{"email":"test@example.com","password":"password123"}'

  # Test authenticated endpoint
  node runner.js http://localhost:8000/api/v1/auth/me --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

  # Stress test with custom settings
  node runner.js http://localhost:8000/api/v1/users --connections 50 --duration 30

  # Quick test with low load
  node runner.js http://localhost:8000/api/v1/users --connections 5 --duration 5
    `);
    process.exit(0);
  }

  const url = args[0];
  const options = {};

  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case "--method":
        options.method = value;
        break;
      case "--connections":
        options.connections = parseInt(value);
        break;
      case "--duration":
        options.duration = parseInt(value);
        break;
      case "--pipelining":
        options.pipelining = parseInt(value);
        break;
      case "--body":
        try {
          options.body = JSON.parse(value);
        } catch (error) {
          console.error("❌ Invalid JSON in --body:", error.message);
          process.exit(1);
        }
        break;
      case "--token":
        options.token = value;
        break;
      case "--timeout":
        options.timeout = parseInt(value);
        break;
      case "--format":
        options.format = value;
        break;
      case "--export":
        options.exportFile = value;
        break;
      default:
        console.error(`❌ Unknown option: ${flag}`);
        process.exit(1);
    }
  }

  return { url, options };
}

async function main() {
  try {
    const { url, options } = parseArgs();

    if (!url) {
      console.error("❌ URL is required");
      process.exit(1);
    }

    console.log("🚀 Starting load test...\n");
    console.log(`📍 URL: ${url}`);
    console.log(`⚙️  Options:`, options);
    console.log("");

    const result = await testEndpoint(url, options);

    // Handle different output formats
    if (options.format === "json") {
      displayResultsJSON(result, url);
    } else if (options.format === "csv") {
      exportToCSV(result, url);
    }

    // Export to file if specified
    if (options.exportFile) {
      exportToCSV(result, url, options.exportFile);
    }

    console.log("✅ Load test completed successfully!");
  } catch (error) {
    console.error("❌ Load test failed:", error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main, parseArgs };
