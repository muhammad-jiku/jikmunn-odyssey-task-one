"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const node_child_process_1 = require("node:child_process");
async function waitForHealth(url, timeoutMs, exitedRef, getLogs) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        if (exitedRef.exited) {
            const logs = getLogs();
            throw new Error(`Server exited early with code ${String(exitedRef.code)}. stdout: ${logs.stdout || "<empty>"}. stderr: ${logs.stderr || "<empty>"}`);
        }
        try {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Health check returned ${res.status}`);
            }
            const body = (await res.json());
            if (body.db?.connected)
                return;
        }
        catch {
            // Retry until timeout.
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
    throw new Error(`Timed out waiting for healthy server at ${url}`);
}
async function main() {
    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    const port = 4019;
    const child = (0, node_child_process_1.spawn)("node", ["dist/src/index.js"], {
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
    const exitedRef = { exited: false, code: null };
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
        await waitForHealth(`http://127.0.0.1:${port}/api/health`, 40000, exitedRef, () => ({ stdout, stderr }));
        console.log("Production boot verification passed.");
        if (stdout.trim())
            console.log(stdout.trim());
    }
    finally {
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
