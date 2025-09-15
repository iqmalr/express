import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  db: {
    url: process.env.DATABASE_URL,
    host: requireEnv("DB_HOST"),
    port: parseInt(requireEnv("DB_PORT"), 10),
    name: requireEnv("DB_NAME"),
    user: requireEnv("DB_USER"),
    pass: requireEnv("DB_PASSWORD"),
  },
  nodeEnv: process.env.NODE_ENV || "development",
};
