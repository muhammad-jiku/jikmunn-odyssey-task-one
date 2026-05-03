import { MongoMemoryServer } from "mongodb-memory-server";
import { spawn } from "node:child_process";

async function waitForHealth(
  url: string,
  timeoutMs: number,
  exitedRef: { exited: boolean; code: number | null },
  getLogs: () => { stdout: string; stderr: string }
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (exitedRef.exited) {
      const logs = getLogs();
      throw new Error(
        `Server exited early with code ${String(exitedRef.code)}. stdout: ${logs.stdout || "<empty>"}. stderr: ${logs.stderr || "<empty>"}`
      );
    }
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Health check returned ${res.status}`);
      }
      const body = (await res.json()) as { db?: { connected?: boolean } };
      if (body.db?.connected) return;
    } catch {
      // Retry until timeout.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for healthy server at ${url}`);
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const port = 4019;
  const child = spawn("node", ["dist/src/index.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      MONGODB_URI: uri,
      CORS_ORIGIN: "http://localhost:3000",
      JWT_ACCESS_SECRET: "test_access_secret_1234567890",
      JWT_REFRESH_SECRET: "test_refresh_secret_1234567890"
    },
    stdio: "pipe"
  });

  let stderr = "";
  let stdout = "";
  const exitedRef = { exited: false, code: null as number | null };

  child.on("exit", (code) => {
    exitedRef.exited = true;
    exitedRef.code = code;
  });

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForHealth(
      `http://127.0.0.1:${port}/api/health`,
      40000,
      exitedRef,
      () => ({ stdout, stderr })
    );
    console.log("Production boot verification passed.");
    if (stdout.trim()) console.log(stdout.trim());
  } finally {
    child.kill("SIGTERM");
    await mongod.stop();
  }

  if (stderr.trim()) {
    // Keep output available for diagnostics without failing the command.
    console.log(stderr.trim());
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
