import { MongoMemoryServer } from "mongodb-memory-server";
import type { Server } from "node:http";

type AuthResponse = {
  ok: boolean;
  accessToken?: string;
  user?: { id: string; role: "user" | "admin"; email: string; name: string };
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function requestJson<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: unknown,
  token?: string
): Promise<{ status: number; data: T }> {
  const response = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  const data = (await response.json()) as T;
  return { status: response.status, data };
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.PORT = "4013";
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

  const { connectToDatabase, disconnectFromDatabase } = await import("../src/config/db");
  const { env } = await import("../src/config/env");
  const { createApp } = await import("../src/app");
  const { ensureDemoUsers } = await import("../src/services/auth.service");

  await connectToDatabase(env.MONGODB_URI);
  await ensureDemoUsers();

  const app = createApp(env.CORS_ORIGIN);
  const server = await new Promise<Server>((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });

  const address = server.address();
  assert(address && typeof address !== "string", "Could not resolve server address");
  const base = `http://127.0.0.1:${address.port}/api`;

  const register = await requestJson<AuthResponse>("POST", `${base}/auth/register`, {
    name: "Phase 4 User",
    email: "phase4@example.com",
    password: "Phase4Pass123!"
  });
  assert(register.status === 201, `Register expected 201, got ${register.status}`);
  assert(register.data.accessToken, "Register did not return access token");

  const submitContact = await requestJson<{ ok: boolean }>("POST", `${base}/contact`, {
    name: "Contact Person",
    email: "contact@example.com",
    subject: "Support needed",
    message: "Please help with my marketplace account issue."
  });
  assert(submitContact.status === 201, `Contact POST expected 201, got ${submitContact.status}`);

  const updateProfile = await requestJson<{ ok: boolean; user?: { name?: string } }>(
    "PATCH",
    `${base}/users/me`,
    { name: "Phase 4 User Updated" },
    register.data.accessToken
  );
  assert(updateProfile.status === 200, `Profile PATCH expected 200, got ${updateProfile.status}`);
  assert(updateProfile.data.user?.name === "Phase 4 User Updated", "Profile name update did not persist");

  const updatePassword = await requestJson<{ ok: boolean }>(
    "PATCH",
    `${base}/users/me/password`,
    { currentPassword: "Phase4Pass123!", newPassword: "Phase4Pass456!" },
    register.data.accessToken
  );
  assert(updatePassword.status === 200, `Password PATCH expected 200, got ${updatePassword.status}`);

  const updateAvatar = await requestJson<{ ok: boolean; user?: { avatarUrl?: string } }>(
    "POST",
    `${base}/users/me/avatar`,
    { avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
    register.data.accessToken
  );
  assert(updateAvatar.status === 200, `Avatar POST expected 200, got ${updateAvatar.status}`);
  assert(updateAvatar.data.user?.avatarUrl, "Avatar update did not persist");

  const adminLogin = await requestJson<AuthResponse>("POST", `${base}/auth/demo-login`, { role: "admin" });
  assert(adminLogin.status === 200, `Demo admin login expected 200, got ${adminLogin.status}`);
  assert(adminLogin.data.accessToken, "Demo admin login missing access token");

  const adminOverview = await requestJson<{ ok: boolean; stats?: { totalUsers?: number } }>(
    "GET",
    `${base}/admin/overview`,
    undefined,
    adminLogin.data.accessToken
  );
  assert(adminOverview.status === 200, `Admin overview expected 200, got ${adminOverview.status}`);
  assert((adminOverview.data.stats?.totalUsers ?? 0) >= 2, "Admin overview stats did not return expected users");

  const adminUsers = await requestJson<{ ok: boolean; rows?: Array<{ id: string; role: string }> }>(
    "GET",
    `${base}/admin/users?page=1&pageSize=10`,
    undefined,
    adminLogin.data.accessToken
  );
  assert(adminUsers.status === 200, `Admin users expected 200, got ${adminUsers.status}`);
  assert((adminUsers.data.rows?.length ?? 0) > 0, "Admin users returned no rows");

  const firstUser = adminUsers.data.rows?.find((row) => row.id === register.data.user?.id);
  assert(firstUser?.id, "Could not find target user in admin users list");

  const roleUpdate = await requestJson<{ ok: boolean; user?: { role?: string } }>(
    "PATCH",
    `${base}/admin/users/${firstUser.id}/role`,
    { role: "admin" },
    adminLogin.data.accessToken
  );
  assert(roleUpdate.status === 200, `Admin role update expected 200, got ${roleUpdate.status}`);
  assert(roleUpdate.data.user?.role === "admin", "Admin role update did not persist");

  const adminItems = await requestJson<{ ok: boolean; rows?: unknown[] }>(
    "GET",
    `${base}/admin/items?page=1&pageSize=10`,
    undefined,
    adminLogin.data.accessToken
  );
  assert(adminItems.status === 200, `Admin items expected 200, got ${adminItems.status}`);

  const adminCharts = await requestJson<{ ok: boolean; data?: { itemsAndMessagesByMonth?: unknown[] } }>(
    "GET",
    `${base}/admin/reports/charts`,
    undefined,
    adminLogin.data.accessToken
  );
  assert(adminCharts.status === 200, `Admin charts expected 200, got ${adminCharts.status}`);
  assert(
    (adminCharts.data.data?.itemsAndMessagesByMonth?.length ?? 0) > 0,
    "Admin charts data did not return month series"
  );

  const contactList = await requestJson<{ ok: boolean; messages?: unknown[] }>(
    "GET",
    `${base}/contact?page=1&pageSize=10`,
    undefined,
    adminLogin.data.accessToken
  );
  assert(contactList.status === 200, `Admin contact list expected 200, got ${contactList.status}`);
  assert((contactList.data.messages?.length ?? 0) > 0, "Admin contact list returned no messages");

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  await disconnectFromDatabase();
  await mongod.stop();

  console.log("Phase 4 + Phase 6 backend verification passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
