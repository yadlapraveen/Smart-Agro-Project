import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get user's cart
router.get('/user/:user_id', async (req, res) => {
  try {
    const [cartItems] = await pool.query(
      'SELECT ci.*, p.title, p.price, p.image_url, p.unit, p.stock_quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ? ORDER BY ci.createdAt DESC',
      [req.params.user_id]
    );

    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if item already in cart
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, user_id, product_id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);

    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// Clear entire cart
router.delete('/user/:user_id', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.params.user_id]);

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
