import express from "express";
import api from "./routes/api.js";

const app = express();
app.use(express.json());

app.use("/api", api);

// Error middleware – produces real stack traces
app.use((err, req, res, next) => {
  const incident = {
    service: "mock-broken-app",
    env: process.env.NODE_ENV || "dev",
    release: process.env.RELEASE_SHA || "local",
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      originalUrl: req.originalUrl,
      routePattern: req.route?.path ? `${req.baseUrl}${req.route.path}` : null,
    },
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
  };

  console.log("\n=== MOCK INCIDENT JSON ===");
  console.log(JSON.stringify(incident, null, 2));

  res.status(500).json({ ok: false, error: err.message });
});


app.listen(3008, () => {
  console.log("Mock app running on http://localhost:3008");
});