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
});

const isProduction = env.nodeEnv === "production";

let sequelize: Sequelize;

if (env.db.url) {
  sequelize = new Sequelize(env.db.url, {
    dialect: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: {
      ssl: isProduction
        ? { require: true, rejectUnauthorized: true }
        : { require: true, rejectUnauthorized: false },
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
      ssl: isProduction
        ? { require: true, rejectUnauthorized: true }
        : { require: true, rejectUnauthorized: false },
    },
  });
}

export default sequelize;
