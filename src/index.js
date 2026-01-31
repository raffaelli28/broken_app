import express from "express";
import api from "./routes/api.js";

const app = express();

// Parse JSON + HTML form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Simple web form so anyone can trigger requests
app.get("/", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Mock Broken App</title>
        <style>
          body { font-family: sans-serif; max-width: 720px; margin: 40px auto; padding: 0 16px; }
          input, button { padding: 10px; font-size: 16px; }
          label { display: block; margin-top: 12px; }
          .row { display: flex; gap: 12px; align-items: center; }
          .row input { flex: 1; }
          .hint { color: #555; font-size: 13px; margin-top: 6px; }
        </style>
      </head>
      <body>
        <h1>Mock Broken App</h1>
        <p>Use this form to hit the API. Later commits can break it to simulate incidents.</p>

        <h2>Charge Payment</h2>
        <form method="POST" action="/api/payments/charge">
          <label>Amount</label>
          <div class="row">
            <input name="amount" type="number" step="0.01" value="25" required />
          </div>

          <label>Currency (optional)</label>
          <div class="row">
            <input name="currency" type="text" value="USD" />
          </div>

          <label>Token (optional — later commits may require this)</label>
          <div class="row">
            <input name="token" type="text" placeholder="tok_123..." />
          </div>
          <div class="hint">Try submitting with token blank vs filled.</div>

          <div style="margin-top: 16px;">
            <button type="submit">Submit</button>
          </div>
        </form>

        <h2>Crash Test</h2>
        <p><a href="/api/crash">Click here to trigger /api/crash</a></p>
      </body>
    </html>
  `);
});

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