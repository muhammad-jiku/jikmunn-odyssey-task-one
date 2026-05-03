import type { Server } from "node:http";
import { createApp } from "./app";
import { connectToDatabase, disconnectFromDatabase } from "./config/db";
import { env } from "./config/env";
import { ensureDemoUsers } from "./services/auth.service";

let server: Server | null = null;

async function bootstrap() {
  await connectToDatabase(env.MONGODB_URI);
  await ensureDemoUsers();

  const app = createApp(env.CORS_ORIGIN);
  server = app.listen(env.PORT, () => {
    console.log(`odyssey-server listening on port ${env.PORT}`);
  });
}

async function shutdown(code: number) {
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    await disconnectFromDatabase();
  } catch {
    // Ignore shutdown errors.
  } finally {
    process.exit(code);
  }
}

bootstrap().catch((error) => {
  console.error("Failed to start odyssey-server", error);
  void shutdown(1);
});

process.on("SIGINT", () => {
  void shutdown(0);
});

process.on("SIGTERM", () => {
  void shutdown(0);
});
