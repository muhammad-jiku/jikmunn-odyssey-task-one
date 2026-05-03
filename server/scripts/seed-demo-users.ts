process.env.PORT = process.env.PORT || "4000";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/odyssey_upgrade";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "replace_me_with_long_access_secret";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "replace_me_with_long_refresh_secret";

async function main() {
  const { connectToDatabase, disconnectFromDatabase } = await import("../src/config/db");
  const { env } = await import("../src/config/env");
  const { ensureDemoUsers } = await import("../src/services/auth.service");

  await connectToDatabase(env.MONGODB_URI);
  await ensureDemoUsers();
  await disconnectFromDatabase();

  console.log("Demo users seeded successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
