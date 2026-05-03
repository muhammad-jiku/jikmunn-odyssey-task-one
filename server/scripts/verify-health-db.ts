import { MongoMemoryServer } from "mongodb-memory-server";
import type { Server } from "node:http";

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  process.env.PORT = "4010";
  process.env.MONGODB_URI = uri;
  process.env.CORS_ORIGIN = "http://localhost:3000";
  process.env.JWT_ACCESS_SECRET = "test_access_secret_1234567890";
  process.env.JWT_REFRESH_SECRET = "test_refresh_secret_1234567890";

  const { connectToDatabase, disconnectFromDatabase } = await import("../src/config/db");
  const { createApp } = await import("../src/app");

  await connectToDatabase(uri);

  const app = createApp("http://localhost:3000");
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not resolve server port");
  }

  const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
  if (!response.ok) {
    throw new Error(`Expected /api/health to return 200, got ${response.status}`);
  }

  const payload = (await response.json()) as {
    db?: { connected?: boolean };
  };

  if (!payload.db?.connected) {
    throw new Error("Expected health payload to report db.connected=true");
  }

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  await disconnectFromDatabase();
  await mongod.stop();

  console.log("Health check with DB connectivity passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
