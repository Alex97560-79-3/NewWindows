import { Router } from 'express';
import db from '../db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from '../services/password';
import { User } from '../types';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const exists = await db<User>('users').where({ email }).first();
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const password_hash = await hashPassword(password);
    const [user] = await db<User>('users').insert({ name, email, password_hash }).returning('*');
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ data: { token, user } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await db<User>('users').where({ email }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await comparePassword(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    // Do not send password_hash back
    const { password_hash, ...userSafe } = user as any;
    res.json({ data: { token, user: userSafe } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;
