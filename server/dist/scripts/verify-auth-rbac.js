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
function assert(condition, message) {
    if (!condition)
        throw new Error(message);
}
async function postJson(url, body, token) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
    });
    const data = (await response.json());
    return { status: response.status, data };
}
async function getJson(url, token) {
    const response = await fetch(url, {
        method: "GET",
        headers: token ? { authorization: `Bearer ${token}` } : {}
    });
    const data = (await response.json());
    return { status: response.status, data };
}
async function main() {
    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    process.env.PORT = "4011";
    process.env.CORS_ORIGIN = "http://localhost:3000";
    process.env.MONGODB_URI = mongod.getUri();
    process.env.JWT_ACCESS_SECRET = "test_access_secret_1234567890";
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret_1234567890";
    process.env.JWT_ACCESS_EXPIRES_IN = "15m";
    process.env.JWT_REFRESH_EXPIRES_IN = "7d";
    process.env.DEMO_ADMIN_NAME = "Admin Demo";
    process.env.DEMO_ADMIN_EMAIL = "admin@odyssey.dev";
    process.env.DEMO_ADMIN_PASSWORD = "AdminDemo123!";
    process.env.DEMO_USER_NAME = "User Demo";
    process.env.DEMO_USER_EMAIL = "user@odyssey.dev";
    process.env.DEMO_USER_PASSWORD = "UserDemo123!";
    const { connectToDatabase, disconnectFromDatabase } = await Promise.resolve().then(() => __importStar(require("../src/config/db")));
    const { env } = await Promise.resolve().then(() => __importStar(require("../src/config/env")));
    const { ensureDemoUsers } = await Promise.resolve().then(() => __importStar(require("../src/services/auth.service")));
    const { createApp } = await Promise.resolve().then(() => __importStar(require("../src/app")));
    await connectToDatabase(env.MONGODB_URI);
    await ensureDemoUsers();
    const app = createApp(env.CORS_ORIGIN);
    const server = await new Promise((resolve) => {
        const s = app.listen(0, () => resolve(s));
    });
    const address = server.address();
    assert(address && typeof address !== "string", "Could not resolve server address");
    const base = `http://127.0.0.1:${address.port}/api`;
    const register = await postJson(`${base}/auth/register`, {
        name: "Tester",
        email: "tester@example.com",
        password: "TestPass123!"
    });
    assert(register.status === 201, `Register expected 201, got ${register.status}`);
    assert(register.data.accessToken && register.data.refreshToken, "Register did not return tokens");
    const login = await postJson(`${base}/auth/login`, {
        email: "tester@example.com",
        password: "TestPass123!"
    });
    assert(login.status === 200, `Login expected 200, got ${login.status}`);
    assert(login.data.accessToken && login.data.refreshToken, "Login did not return tokens");
    const demoUser = await postJson(`${base}/auth/demo-login`, { role: "user" });
    assert(demoUser.status === 200, `Demo user login expected 200, got ${demoUser.status}`);
    assert(demoUser.data.user?.role === "user", "Demo user role mismatch");
    const demoAdmin = await postJson(`${base}/auth/demo-login`, { role: "admin" });
    assert(demoAdmin.status === 200, `Demo admin login expected 200, got ${demoAdmin.status}`);
    assert(demoAdmin.data.user?.role === "admin", "Demo admin role mismatch");
    const unauthorizedProfile = await getJson(`${base}/protected/profile`);
    assert(unauthorizedProfile.status === 401, `Protected profile without token expected 401, got ${unauthorizedProfile.status}`);
    const forbiddenAdmin = await getJson(`${base}/protected/admin`, demoUser.data.accessToken);
    assert(forbiddenAdmin.status === 403, `Admin route with user token expected 403, got ${forbiddenAdmin.status}`);
    const adminAllowed = await getJson(`${base}/protected/admin`, demoAdmin.data.accessToken);
    assert(adminAllowed.status === 200, `Admin route with admin token expected 200, got ${adminAllowed.status}`);
    const refresh = await postJson(`${base}/auth/refresh`, {
        refreshToken: login.data.refreshToken
    });
    assert(refresh.status === 200, `Refresh expected 200, got ${refresh.status}`);
    assert(refresh.data.refreshToken, "Refresh did not return new refresh token");
    const logout = await postJson(`${base}/auth/logout`, {
        refreshToken: refresh.data.refreshToken
    });
    assert(logout.status === 200, `Logout expected 200, got ${logout.status}`);
    const refreshAfterLogout = await postJson(`${base}/auth/refresh`, {
        refreshToken: refresh.data.refreshToken
    });
    assert(refreshAfterLogout.status === 401, `Refresh with revoked token expected 401, got ${refreshAfterLogout.status}`);
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
    console.log("Auth + RBAC verification passed.");
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
