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
process.env.PORT = process.env.PORT || "4000";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/odyssey_upgrade";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "replace_me_with_long_access_secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "replace_me_with_long_refresh_secret";
async function main() {
    const { connectToDatabase, disconnectFromDatabase } = await Promise.resolve().then(() => __importStar(require("../src/config/db")));
    const { env } = await Promise.resolve().then(() => __importStar(require("../src/config/env")));
    const { ensureDemoUsers } = await Promise.resolve().then(() => __importStar(require("../src/services/auth.service")));
    await connectToDatabase(env.MONGODB_URI);
    await ensureDemoUsers();
    await disconnectFromDatabase();
    console.log("Demo users seeded successfully.");
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
