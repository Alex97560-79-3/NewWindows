import { Router } from 'express';
import db from '../db';
import { Product } from '../types';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    // Можно расширить фильтры: ?search=&category=&minPrice=&maxPrice=&brand=&saleOnly=
    const q = db<Product>('products').select('*');
    if (req.query.search) q.whereILike('name', `%${String(req.query.search)}%`);
    if (req.query.category) q.where('category', req.query.category as string);
    if (req.query.brand) q.where('brand', req.query.brand as string);
    if (req.query.saleOnly === 'true') q.where('is_sale', true);
    const products = await q.orderBy('created_at', 'desc');
    res.json({ data: products });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await db<Product>('products').where({ id }).first();
    if (!product) return res.status(404).json({ error: 'Not found' });
    const tags = await db('product_tags').where({ product_id: id }).pluck('tag');
    res.json({ data: { ...product, tags } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products (admin)
router.post('/', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req, res) => {
  try {
    const payload = req.body;
    const [product] = await db<Product>('products').insert(payload).returning('*');
    // tags
    if (payload.tags && Array.isArray(payload.tags)) {
      await Promise.all(payload.tags.map((t: string) => db('product_tags').insert({ product_id: product.id, tag: t })));
    }
    res.json({ data: product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id
router.put('/:id', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body;
    await db<Product>('products').where({ id }).update({ ...payload, updated_at: db.fn.now() as any });
    // update tags: simple approach - delete and reinsert
    if (payload.tags) {
      await db('product_tags').where({ product_id: id }).del();
      await Promise.all(payload.tags.map((t: string) => db('product_tags').insert({ product_id: id, tag: t })));
    }
    const product = await db<Product>('products').where({ id }).first();
    res.json({ data: product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db<Product>('products').where({ id }).del();
    res.json({ data: { success: true } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
