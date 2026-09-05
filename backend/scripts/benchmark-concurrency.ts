import http from 'http';
import https from 'https';

interface BenchmarkResult {
  endpoint: string;
  concurrency: number;
  totalRequests: number;
  successful: number;
  failed: number;
  rateLimited: number;
  totalTimeMs: number;
  requestsPerSecond: number;
  latencies: {
    min: number;
    avg: number;
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    max: number;
  };
}

const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 1000,
  maxFreeSockets: 200,
});

async function sendRequest(url: string, headers: Record<string, string> = {}): Promise<{ status: number; duration: number }> {
  const start = performance.now();
  const parsedUrl = new URL(url);

  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        agent: httpAgent,
        headers: {
          Connection: 'keep-alive',
          'User-Agent': 'EduGuide-Benchmark/1.0',
          ...headers,
        },
      },
      (res) => {
        // Consume response data to free socket
        res.on('data', () => {});
        res.on('end', () => {
          const duration = performance.now() - start;
          resolve({ status: res.statusCode || 0, duration });
        });
      }
    );

    req.on('error', () => {
      const duration = performance.now() - start;
      resolve({ status: 0, duration });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      const duration = performance.now() - start;
      resolve({ status: 504, duration });
    });

    req.end();
  });
}

function computePercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return Math.round(sorted[Math.max(0, Math.min(index, sorted.length - 1))]);
}

async function runBurstTest(
  url: string,
  concurrency: number,
  label: string,
  headers: Record<string, string> = {}
): Promise<BenchmarkResult> {
  const promises: Promise<{ status: number; duration: number }>[] = [];
  const startOverall = performance.now();

  for (let i = 0; i < concurrency; i++) {
    promises.push(sendRequest(url, headers));
  }

  const results = await Promise.all(promises);
  const totalTimeMs = performance.now() - startOverall;

  const latencies = results.map((r) => r.duration).sort((a, b) => a - b);
  const successful = results.filter((r) => r.status >= 200 && r.status < 300).length;
  const rateLimited = results.filter((r) => r.status === 429).length;
  const failed = results.length - successful - rateLimited;

  const sumLatency = latencies.reduce((acc, l) => acc + l, 0);
  const avg = Math.round(sumLatency / latencies.length);

  return {
    endpoint: label,
    concurrency,
    totalRequests: concurrency,
    successful,
    failed,
    rateLimited,
    totalTimeMs: Math.round(totalTimeMs),
    requestsPerSecond: Math.round((concurrency / (totalTimeMs / 1000)) * 10) / 10,
    latencies: {
      min: Math.round(latencies[0] || 0),
      avg,
      p50: computePercentile(latencies, 50),
      p90: computePercentile(latencies, 90),
      p95: computePercentile(latencies, 95),
      p99: computePercentile(latencies, 99),
      max: Math.round(latencies[latencies.length - 1] || 0),
    },
  };
}

async function runSustainedTest(
  url: string,
  concurrency: number,
  durationSeconds: number,
  label: string
): Promise<BenchmarkResult> {
  const startTime = performance.now();
  const endTime = startTime + durationSeconds * 1000;
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;
  let rateLimited = 0;

  async function worker() {
    while (performance.now() < endTime) {
      const res = await sendRequest(url);
      latencies.push(res.duration);
      if (res.status >= 200 && res.status < 300) {
        successful++;
      } else if (res.status === 429) {
        rateLimited++;
      } else {
        failed++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const totalTimeMs = performance.now() - startTime;
  latencies.sort((a, b) => a - b);
  const totalRequests = latencies.length;
  const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1));

  return {
    endpoint: label,
    concurrency,
    totalRequests,
    successful,
    failed,
    rateLimited,
    totalTimeMs: Math.round(totalTimeMs),
    requestsPerSecond: Math.round((totalRequests / (totalTimeMs / 1000)) * 10) / 10,
    latencies: {
      min: Math.round(latencies[0] || 0),
      avg,
      p50: computePercentile(latencies, 50),
      p90: computePercentile(latencies, 90),
      p95: computePercentile(latencies, 95),
      p99: computePercentile(latencies, 99),
      max: Math.round(latencies[latencies.length - 1] || 0),
    },
  };
}

async function main() {
  const BASE_URL = process.env.TARGET_URL || 'http://localhost:4000';
  console.log(`\n======================================================`);
  console.log(`  EduGuide Backend High-Concurrency Benchmark Suite`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  // Warmup request
  console.log('[Warmup] Initializing connection pool & JIT...');
  await sendRequest(`${BASE_URL}/api/health`);
  await sendRequest(`${BASE_URL}/api/universities`);
  console.log('[Warmup] Complete.\n');

  const allResults: BenchmarkResult[] = [];

  // ==========================================
  // Test 1: Event Loop Capacity (/api/health)
  // ==========================================
  console.log('--- Test 1: Event Loop Capacity (/api/health) ---');
  for (const c of [50, 100, 250, 500, 1000]) {
    const res = await runBurstTest(`${BASE_URL}/api/health`, c, `/api/health (Burst ${c})`);
    allResults.push(res);
    console.log(
      `  Concurrency ${c.toString().padEnd(4)}: ${res.successful}/${res.totalRequests} OK | RPS: ${res.requestsPerSecond.toFixed(1).padEnd(7)} | Avg: ${res.latencies.avg}ms | p50: ${res.latencies.p50}ms | p95: ${res.latencies.p95}ms | p99: ${res.latencies.p99}ms`
    );
    await new Promise((r) => setTimeout(r, 300));
  }

  // ==========================================
  // Test 2: Database Query Endpoints (/api/universities)
  // ==========================================
  console.log('\n--- Test 2: Universities DB/Cache Endpoint (/api/universities) ---');
  for (const c of [25, 50, 100, 200, 400]) {
    const res = await runBurstTest(`${BASE_URL}/api/universities`, c, `/api/universities (Burst ${c})`);
    allResults.push(res);
    console.log(
      `  Concurrency ${c.toString().padEnd(4)}: ${res.successful}/${res.totalRequests} OK | RPS: ${res.requestsPerSecond.toFixed(1).padEnd(7)} | Avg: ${res.latencies.avg}ms | p50: ${res.latencies.p50}ms | p95: ${res.latencies.p95}ms | p99: ${res.latencies.p99}ms`
    );
    await new Promise((r) => setTimeout(r, 400));
  }

  // ==========================================
  // Test 3: Complex Paginated Admissions Query (/api/admissions)
  // ==========================================
  console.log('\n--- Test 3: Complex Paginated Query (/api/admissions?limit=10) ---');
  for (const c of [25, 50, 100, 200]) {
    const res = await runBurstTest(`${BASE_URL}/api/admissions?limit=10`, c, `/api/admissions (Burst ${c})`);
    allResults.push(res);
    console.log(
      `  Concurrency ${c.toString().padEnd(4)}: ${res.successful}/${res.totalRequests} OK | RPS: ${res.requestsPerSecond.toFixed(1).padEnd(7)} | Avg: ${res.latencies.avg}ms | p50: ${res.latencies.p50}ms | p95: ${res.latencies.p95}ms | p99: ${res.latencies.p99}ms`
    );
    await new Promise((r) => setTimeout(r, 400));
  }

  // ==========================================
  // Test 4: Sustained High Throughput (5-second load)
  // ==========================================
  console.log('\n--- Test 4: Sustained Throughput (50 concurrent workers, 5s duration) ---');
  const sustained = await runSustainedTest(`${BASE_URL}/api/health`, 50, 5, `/api/health (50 workers 5s)`);
  allResults.push(sustained);
  console.log(
    `  Total: ${sustained.totalRequests} reqs in ${sustained.totalTimeMs}ms | Throughput: ${sustained.requestsPerSecond} req/s | Success: ${sustained.successful} | Latency: Avg ${sustained.latencies.avg}ms, p50 ${sustained.latencies.p50}ms, p95 ${sustained.latencies.p95}ms`
  );

  console.log(`\n======================================================`);
  console.log(`  Summary Report`);
  console.log(`======================================================`);
  console.log(JSON.stringify(allResults, null, 2));

  process.exit(0);
}

main().catch((err) => {
  console.error('Benchmark error:', err);
  process.exit(1);
});
