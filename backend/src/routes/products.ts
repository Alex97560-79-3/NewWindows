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
    if (req.query.category) q.where('category_id', req.query.category as string);
    if (req.query.brand) q.where('brand', req.query.brand as string);
    if (req.query.saleOnly === 'true') q.where('is_sale', true);
    const products = await q.orderBy('created_at', 'desc');
    
    // Генерируем недостающие поля и обрабатываем image_url
    const productsWithData = products.map((p: any) => {
      let imageUrl = p.image_url;
      // Если это просто имя файла (img1.png, img2.png и т.д.) - добавляем префикс
      if (imageUrl && !imageUrl.includes('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/uploads/${imageUrl}`;
      }
      return {
        ...p,
        image_url: imageUrl,
        discount: p.discount || (p.is_sale ? 15 : 0),
        is_original: p.is_original !== undefined ? p.is_original : true,
        rating: p.rating || 4.5,
        review_count: p.review_count || 0
      };
    });
    
    res.json({ data: productsWithData });
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
    
    // Обрабатываем image_url
    let imageUrl = product.image_url;
    if (imageUrl && !imageUrl.includes('http') && !imageUrl.startsWith('/')) {
      imageUrl = `/uploads/${imageUrl}`;
    }
    
    const productWithData = {
      ...product,
      image_url: imageUrl,
      discount: product.discount || (product.is_sale ? 15 : 0),
      is_original: product.is_original !== undefined ? product.is_original : true,
      rating: product.rating || 4.5,
      review_count: product.review_count || 0,
      tags
    };
    
    res.json({ data: productWithData });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products (admin)
router.post('/', authMiddleware, requireRole(['admin','manager']), async (req, res) => {
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
router.put('/:id', authMiddleware, requireRole(['admin','manager']), async (req, res) => {
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
router.delete('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
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
