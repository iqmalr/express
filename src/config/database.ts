import { Sequelize } from "sequelize";
import { env } from "./env.js";

console.log("🟢 Loaded ENV:");
console.log({
  DB_HOST: env.db.host,
  DB_PORT: env.db.port,
  DB_NAME: env.db.name,
  DB_USER: env.db.user,
  DB_PASSWORD: env.db.pass ? "******" : null,
  POSTGRES_URL: env.db.url ? "exists" : "not set",
  NODE_ENV: env.nodeEnv,
});

const isProduction = env.nodeEnv === "production";

let sequelize: Sequelize;

// Konfigurasi SSL untuk Supabase
const sslConfig = {
  require: true,
  rejectUnauthorized: false, // Supabase menggunakan self-signed certificate
};

if (env.db.url) {
  sequelize = new Sequelize(env.db.url, {
    dialect: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: {
      ssl: sslConfig,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Untuk Vercel serverless functions
    define: {
      timestamps: true,
    },
  });
} else {
  sequelize = new Sequelize({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    username: env.db.user,
    password: env.db.pass,
    dialect: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: {
      ssl: sslConfig,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

// Test koneksi
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// Hanya test koneksi di development
if (env.nodeEnv === "development") {
  testConnection();
}

export default sequelize;
