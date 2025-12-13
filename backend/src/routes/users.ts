import { Router } from 'express';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { hashPassword } from '../services/password';
import { User } from '../types';

const router = Router();

// GET /api/users  (admin only)
router.get('/', authMiddleware, requireRole(['admin','manager']), async (req, res) => {
  try {
    const users = await db<User>('users').select('id','name','email','role','avatar_url','created_at');
    res.json({ data: users });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users (create user) admin only
router.post('/', authMiddleware, requireRole(['admin','manager']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await db<User>('users').where({ email }).first();
    if (exists) return res.status(400).json({ error: 'Email already used' });
    const password_hash = password ? await hashPassword(password) : undefined;
    const [user] = await db<User>('users').insert({ name, email, password_hash, role }).returning('*');
    const { password_hash: ph, ...userSafe } = user as any;
    res.json({ data: userSafe });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id (update)
router.put('/:id', authMiddleware, requireRole(['admin','manager']), async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const payload = { ...req.body };
    if (payload.password) {
      payload.password_hash = await hashPassword(payload.password);
      delete payload.password;
    }
    await db<User>('users').where({ id }).update(payload);
    const user = await db<User>('users').where({ id }).first().select('id','name','email','role','avatar_url','created_at');
    res.json({ data: user });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const payload: Partial<User> = { ...req.body };

    if (payload.avatar_url) {
      payload.avatar_url = payload.avatar_url;
      delete payload.avatar_url;
    }

    if (payload.password_hash) {
      payload.password_hash = await hashPassword(payload.password_hash);
      delete payload.password_hash;
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    await db<User>('users').where({ id: userId }).update(payload);

    const user = await db<User>('users')
      .where({ id: userId })
      .first()
      .select('id','name','email','role','avatar_url','created_at');

    res.json({ data: user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE /api/users/:id
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db<User>('users').where({ id }).del();
    res.json({ data: { success: true } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
