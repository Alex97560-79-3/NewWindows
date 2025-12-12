import { Router } from 'express';
import db from '../db';
import { Review } from '../types';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = Router();

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await db<Review>('reviews').select('*').orderBy('created_at', 'desc');
    res.json({ data: reviews });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    const [review] = await db<Review>('reviews').insert(payload).returning('*');
    res.json({ data: review });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/reviews/:id (reply or edit) - require manager
router.put('/:id', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body;
    await db<Review>('reviews').where({ id }).update(payload);
    const review = await db<Review>('reviews').where({ id }).first();
    res.json({ data: review });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db<Review>('reviews').where({ id }).del();
    res.json({ data: { success: true } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
