import { Sequelize } from "sequelize";
import { env } from "./env.js";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
let sequelize: Sequelize;

if (env.db.url) {
  // Pakai connection URL
  sequelize = new Sequelize(env.db.url, {
    dialect: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase SSL cert
      },
    },
  });
} else {
  // Pakai host/port manual
  sequelize = new Sequelize({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    username: env.db.user,
    password: env.db.pass,
    dialect: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

console.log("🟢 Loaded ENV:");
console.log({
  DB_HOST: env.db.host,
  DB_PORT: env.db.port,
  DB_NAME: env.db.name,
  DB_USER: env.db.user,
  DB_PASSWORD: env.db.pass ? "******" : null,
  POSTGRES_URL: env.db.url ? "exists" : "not set",
});

export default sequelize;
