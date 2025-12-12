import { Router } from 'express';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { hashPassword } from '../services/password';
import { User } from '../types';

const router = Router();

// GET /api/users  (admin only)
router.get('/', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req, res) => {
  try {
    const users = await db<User>('users').select('id','name','email','role','avatar_url','created_at');
    res.json({ data: users });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users (create user) admin only
router.post('/', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req, res) => {
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
router.put('/:id', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req: AuthRequest, res) => {
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

// DELETE /api/users/:id
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req, res) => {
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
