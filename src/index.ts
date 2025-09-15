import express from "express";
import { env } from "./config/env.js";
import sequelize from "./config/database.js";
import cors from "cors";
import logger from "./middlewares/logger.js";
import helloRoutes from "./routes/hello.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();

const welcomeStrings = [
  "Hello Express!",
  "To learn more about Express on Vercel, visit https://vercel.com/docs/frameworks/backend/express",
];
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(logger);

app.use("/api/hello", helloRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/auth", authRoutes);
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
(async () => {
  try {
    await sequelize.authenticate();
    console.log("📦 Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("🗄️ Database synced");
  } catch (error) {
    console.error("❌ Failed to connect database:", error);
  }
})();
export default app;
