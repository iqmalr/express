import { Sequelize, Dialect } from "sequelize";
import pg from "pg";
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

const sslConfig = {
  require: true,
  rejectUnauthorized: !isProduction ? false : true,
};

const commonOptions = {
  dialect: "postgres" as Dialect,
  dialectModule: pg,
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
  define: {
    timestamps: true,
  },
};

let sequelize: Sequelize;

if (env.db.url) {
  sequelize = new Sequelize(env.db.url, commonOptions);
} else {
  sequelize = new Sequelize({
    ...commonOptions,
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    username: env.db.user,
    password: env.db.pass,
  } as any);
}

if (!isProduction) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
    }
  })();
}

export default sequelize;
