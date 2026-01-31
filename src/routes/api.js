import { Router } from "express";
const router = Router();

// Simple crash route
router.get("/crash", (req, res) => {
  // Guaranteed TypeError → stack trace points to this file
  const x = req.body.value.test;
  res.json({ ok: true, x });
});

export default router;