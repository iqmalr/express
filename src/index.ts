import express from "express";
import { env } from "./config/env.js";
import sequelize from "./config/database.js";

const app = express();

const welcomeStrings = [
  "Hello Express!",
  "To learn more about Express on Vercel, visit https://vercel.com/docs/frameworks/backend/express",
];

app.get("/", (_req, res) => {
  res.send(welcomeStrings.join("\n\n"));
});
app.get("/api/health", async (_req, res) => {
  let dbStatus = "unknown";
  try {
    await sequelize.authenticate();
    dbStatus = "connected";
  } catch (err) {
    console.error("❌ DB connection error:", err);
    dbStatus = "failed";
  }

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    db: {
      host: env.db.host,
      port: env.db.port,
      name: env.db.name,
      user: env.db.user,
      password: env.db.pass ? "******" : null,
      POSTGRES_URL: env.db.url ? "exists" : "not set",
      connection: dbStatus,
    },
  });
});
export default app;
