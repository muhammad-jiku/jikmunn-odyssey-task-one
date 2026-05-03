"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
async function main() {
    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.PORT = "4010";
    process.env.MONGODB_URI = uri;
    process.env.CORS_ORIGIN = "http://localhost:3000";
    process.env.JWT_ACCESS_SECRET = "test_access_secret_1234567890";
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret_1234567890";
    const { connectToDatabase, disconnectFromDatabase } = await Promise.resolve().then(() => __importStar(require("../src/config/db")));
    const { createApp } = await Promise.resolve().then(() => __importStar(require("../src/app")));
    await connectToDatabase(uri);
    const app = createApp("http://localhost:3000");
    const server = await new Promise((resolve) => {
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
    const payload = (await response.json());
    if (!payload.db?.connected) {
        throw new Error("Expected health payload to report db.connected=true");
    }
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err)
                reject(err);
            else
                resolve();
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
