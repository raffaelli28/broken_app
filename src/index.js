import express from "express";
import api from "./routes/api.js";

const app = express();
app.use(express.json());

app.use("/api", api);

// Error middleware – produces real stack traces
app.use((err, req, res, next) => {
  console.error("\n=== MOCK INCIDENT ===");
  console.error(err.stack);
  res.status(500).json({ ok: false, error: err.message });
});

app.listen(3008, () => {
  console.log("Mock app running on http://localhost:3008");
});