import express from "express";

const app = express();

const welcomeStrings = [
  "Hello Express!",
  "To learn more about Express on Vercel, visit https://vercel.com/docs/frameworks/backend/express",
];

app.get("/", (_req, res) => {
  res.send(welcomeStrings.join("\n\n"));
});
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});
export default app;
