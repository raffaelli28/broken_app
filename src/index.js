import express from "express";
import api from "./routes/api.js";

const app = express();

// Parse JSON + HTML form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (public/index.html at /)
app.use(express.static("public"));

app.use("/api", api);

// ✅ Error middleware – prints stack trace for your pipeline
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