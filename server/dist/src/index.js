"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const auth_service_1 = require("./services/auth.service");
let server = null;
async function bootstrap() {
    await (0, db_1.connectToDatabase)(env_1.env.MONGODB_URI);
    await (0, auth_service_1.ensureDemoUsers)();
    const app = (0, app_1.createApp)(env_1.env.CORS_ORIGIN);
    server = app.listen(env_1.env.PORT, () => {
        console.log(`odyssey-server listening on port ${env_1.env.PORT}`);
    });
}
async function shutdown(code) {
    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server?.close((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
        await (0, db_1.disconnectFromDatabase)();
    }
    catch {
        // Ignore shutdown errors.
    }
    finally {
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
