import { Router } from 'express';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { Order, OrderItem } from '../types';

const router = Router();

// GET /api/orders
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const role = req.user?.role;
    if (role === 'ADMIN' || role === 'MANAGER') {
      const orders = await db<Order>('orders').select('*').orderBy('created_at', 'desc');
      // fetch items & comments for each?
      res.json({ data: orders });
    } else {
      const orders = await db<Order>('orders').where('customer_id', req.user.id).orderBy('created_at', 'desc');
      res.json({ data: orders });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:id
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const order = await db<Order>('orders').where({ id }).first();
    if (!order) return res.status(404).json({ error: 'Not found' });
    const items = await db<OrderItem>('order_items').where({ order_id: id });
    const comments = await db('order_comments').where({ order_id: id }).orderBy('created_at', 'asc');
    res.json({ data: { ...order, items, comments } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, items, comments } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items provided' });

    // compute total server-side to avoid tampering:
    let totalAmount = 0;
    for (const it of items) {
      // it: { productId, quantity, basePrice }
      const product = await db('products').where({ id: it.productId }).first();
      const price = product ? Number(product.base_price) : Number(it.basePrice || 0);
      totalAmount += price * Number(it.quantity || 1);
    }

    const [order] = await db<Order>('orders').insert({
      customer_id: req.body.customerId || null,
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      total_amount: totalAmount
    }).returning('*');

    // insert items
    for (const it of items) {
      await db('order_items').insert({
        order_id: order.id,
        product_id: it.productId,
        name: it.name || null,
        image_url: it.imageUrl || null,
        quantity: it.quantity,
        base_price: it.basePrice
      });
    }

    // insert comments
    if (comments && Array.isArray(comments)) {
      for (const c of comments) {
        await db('order_comments').insert({
          order_id: order.id,
          author: c.author || null,
          text: c.text || null,
          is_internal: !!c.isInternal
        });
      }
    }

    const created = await db<Order>('orders').where({ id: order.id }).first();
    res.json({ data: created });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/orders/:id (update status or other fields)
router.put('/:id', authMiddleware, requireRole(['ADMIN','MANAGER','ASSEMBLER']), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const payload = req.body;
    await db<Order>('orders').where({ id }).update({ ...payload, updated_at: db.fn.now() as any });
    const order = await db<Order>('orders').where({ id }).first();
    res.json({ data: order });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
