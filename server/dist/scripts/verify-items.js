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
async function patchJson(url, body, token) {
    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
    });
    const data = (await response.json());
    return { status: response.status, data };
}
async function deleteJson(url, token) {
    const response = await fetch(url, {
        method: "DELETE",
        headers: token ? { authorization: `Bearer ${token}` } : {}
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
    process.env.PORT = "4012";
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
    const userLogin = await postJson(`${base}/auth/demo-login`, { role: "user" });
    assert(userLogin.status === 200, `Demo user login expected 200, got ${userLogin.status}`);
    assert(userLogin.data.accessToken && userLogin.data.user, "Demo user login missing token/user");
    const adminLogin = await postJson(`${base}/auth/demo-login`, { role: "admin" });
    assert(adminLogin.status === 200, `Demo admin login expected 200, got ${adminLogin.status}`);
    assert(adminLogin.data.accessToken && adminLogin.data.user, "Demo admin login missing token/user");
    const create = await postJson(`${base}/items`, {
        title: "Vintage Desk Lamp",
        shortDescription: "Hand-restored brass lamp in perfect working condition.",
        fullDescription: "A hand-restored brass desk lamp with new wiring and bulb included. Perfect for reading corners and office desks.",
        price: 89,
        category: "home",
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
    }, userLogin.data.accessToken);
    assert(create.status === 201, `Create item expected 201, got ${create.status}`);
    assert(create.data.item, "Create item response missing item");
    const itemId = create.data.item.id;
    const listAll = await getJson(`${base}/items?page=1&pageSize=20&sort=featured`);
    assert(listAll.status === 200, `List items expected 200, got ${listAll.status}`);
    assert(listAll.data.items?.some((item) => item.id === itemId), "Created item missing from list endpoint");
    const listMineNoAuth = await getJson(`${base}/items?owner=me`);
    assert(listMineNoAuth.status === 401, `Owner=me without auth expected 401, got ${listMineNoAuth.status}`);
    const listMine = await getJson(`${base}/items?owner=me`, userLogin.data.accessToken);
    assert(listMine.status === 200, `Owner=me with auth expected 200, got ${listMine.status}`);
    assert(listMine.data.items?.some((item) => item.id === itemId), "Created item missing from owner=me list");
    const updateByOwner = await patchJson(`${base}/items/${itemId}`, { price: 99, title: "Vintage Desk Lamp (Updated)" }, userLogin.data.accessToken);
    assert(updateByOwner.status === 200, `Owner update expected 200, got ${updateByOwner.status}`);
    const strangerLogin = await postJson(`${base}/auth/register`, {
        name: "Another User",
        email: "another@example.com",
        password: "AnotherPass123!"
    });
    assert(strangerLogin.status === 201, `Register second user expected 201, got ${strangerLogin.status}`);
    assert(strangerLogin.data.accessToken, "Second user register missing token");
    const updateByStranger = await patchJson(`${base}/items/${itemId}`, { price: 79 }, strangerLogin.data.accessToken);
    assert(updateByStranger.status === 403, `Non-owner update expected 403, got ${updateByStranger.status}`);
    const deleteByAdmin = await deleteJson(`${base}/items/${itemId}`, adminLogin.data.accessToken);
    assert(deleteByAdmin.status === 200, `Admin delete expected 200, got ${deleteByAdmin.status}`);
    const getDeleted = await getJson(`${base}/items/${itemId}`);
    assert(getDeleted.status === 404, `Deleted item fetch expected 404, got ${getDeleted.status}`);
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
    console.log("Items API verification passed.");
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
