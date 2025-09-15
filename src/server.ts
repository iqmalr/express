import app from "./index.js";

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
