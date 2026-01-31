import { Router } from 'express';
const router = Router();

router.get('/crash', (req, res) => {
  const x = req.body.value.test; // still crashes for testing
  res.json({ ok: true, x });
});

// ✅ Used by the web form
router.post('/payments/charge', async (req, res, next) => {
  try {
    // req.body is from the form; values come in as strings
    const amount = Number(req.body.amount);
    const customerId = req.body.customer_id;

    // Keep it simple for now
    if (!Number.isFinite(amount)) throw new Error('Invalid amount');

    res.json({
      ok: true,
      charged: amount,
      currency: req.body.currency || 'USD',
      tokenProvided: !!token,
      customerId,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
