import express from 'express';
import pool from '../db.js';

const router = express.Router();


// =============================
// REGISTER
// =============================
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Insert new user
    await pool.query(
      'INSERT INTO users (email, password, full_name) VALUES (?, ?, ?)',
      [email, password, full_name || '']
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: 'Registration failed' });
  }
});


// =============================
// LOGIN 
// =============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", email, password); // DEBUG

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Password check
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ✅ FIXED RESPONSE FORMAT
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name || "",
        is_seller: user.is_seller || false,
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || ""
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// =============================
// GET PROFILE
// =============================
router.get('/profile/:id', async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    delete user.password;

    res.json({
      success: true,
      user: user
    });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});


// =============================
// UPDATE PROFILE
// =============================
router.put('/profile/:id', async (req, res) => {
  try {
    const { full_name, phone, address, city, country } = req.body;

    await pool.query(
      `UPDATE users 
       SET full_name = ?, phone = ?, address = ?, city = ?, country = ? 
       WHERE id = ?`,
      [full_name, phone, address, city, country, req.params.id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;