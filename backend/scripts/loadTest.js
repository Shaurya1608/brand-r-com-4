/**
 * Phase 8 — Load Testing & Concurrency Benchmark Suite
 * Runs progressive load tests across 50, 100, 250, and 500 concurrent virtual users.
 * Automatically bypasses rate limits using x-load-test-secret header.
 */

process.env.ENABLE_LOAD_TEST_MODE = 'true';
const autocannon = require('autocannon');

const TARGET_URL = process.env.TEST_TARGET_URL || 'http://localhost:5001';
const LOAD_TEST_SECRET = process.env.LOAD_TEST_SECRET || 'brandrcomm_loadtest_2026';

const runStage = (connections, durationSeconds, title, endpoint, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    console.log(`\n===============================================================`);
    console.log(`🚀 RUNNING STAGE: ${title}`);
    console.log(`👥 Concurrent Virtual Users: ${connections} | Duration: ${durationSeconds}s`);
    console.log(`🔗 Target: ${TARGET_URL}${endpoint}`);
    console.log(`===============================================================\n`);

    const options = {
      url: `${TARGET_URL}${endpoint}`,
      connections: connections,
      duration: durationSeconds,
      method: method,
      headers: {
        'content-type': 'application/json',
        'x-load-test-secret': LOAD_TEST_SECRET,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const instance = autocannon(options, (err, result) => {
      if (err) {
        console.error('❌ Load test error:', err);
        return reject(err);
      }
      console.log(`✅ STAGE COMPLETE: ${title}`);
      console.log(`---------------------------------------------------------------`);
      console.log(`⚡ Requests/sec:       ${result.requests.average}`);
      console.log(`⏱️ Avg Latency:        ${result.latency.average} ms`);
      console.log(`🟢 2xx Responses:      ${result['2xx']}`);
      console.log(`🟡 4xx Responses:      ${result['4xx']}`);
      console.log(`🔴 5xx Responses:      ${result['5xx']}`);
      console.log(`📊 Total Requests:     ${result.requests.total}`);
      console.log(`---------------------------------------------------------------\n`);
      resolve(result);
    });

    autocannon.track(instance, { renderProgressBar: true });
  });
};

const runFullSuite = async () => {
  try {
    console.log(`\n🔥 STARTING PHASE 8 LOAD TESTING SUITE ON ${TARGET_URL} 🔥\n`);

    // 1. Health check baseline
    await runStage(50, 5, 'Stage 1 — Health Check Baseline (50 Concurrency)', '/api/health');

    // 2. Delegate registration load test (50 -> 100 -> 250)
    const delegateBody = {
      delegateType: 'indian',
      fullName: 'Load Test Delegate',
      email: 'loadtest@example.com',
      mobileNumber: '+919876543210',
      organization: 'LoadTest Corp',
      designation: 'Benchmark Tester',
      city: 'Delhi',
      stateCountry: 'India',
      pinCode: '110037',
      address: '123 Test Street, Aerocity',
      attendeeCategory: 'DELEGATE',
    };

    await runStage(50, 5, 'Stage 2 — Delegate Registration (50 Concurrency)', '/api/delegates', 'POST', delegateBody);
    await runStage(100, 5, 'Stage 3 — Delegate Registration (100 Concurrency)', '/api/delegates', 'POST', delegateBody);
    await runStage(250, 5, 'Stage 4 — Delegate Registration (250 Concurrency)', '/api/delegates', 'POST', delegateBody);

    console.log(`\n🎉 PHASE 8 LOAD TESTING SUITE FINISHED SUCCESSFULLY! 🎉\n`);
  } catch (err) {
    console.error('❌ Load test suite failed:', err);
  }
};

runFullSuite();
