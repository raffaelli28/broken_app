import { Router } from "express";
const router = Router();

router.get("/crash", (req, res) => {
  const x = req.body.value.test; // still crashes for testing
  res.json({ ok: true, x });
});

// ✅ Used by the web form
router.post("/payments/charge", async (req, res, next) => {
  try {
    // req.body is from the form; values come in as strings
    const amount = Number(req.body.amount);

    // Keep it simple for now
    if (!Number.isFinite(amount)) throw new Error("Invalid amount");

    // Token optional NOW — later commits can make it required/breaking
    const token = req.body.token || null;

    res.json({
      ok: true,
      charged: amount,
      currency: req.body.currency || "USD",
      tokenProvided: !!token,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
