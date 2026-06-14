/**
 * BACKEND SERVER WITH EXPRESS AND MYSQL FOR UNPAD MERCH HUB
 * Fitur: Auth (Login, Register), Products, Categories, Orders, Notifications
 * Dependencies: npm install express mysql2 cors dotenv body-parser
 */

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.MYSQL_BACKEND_PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Database Credentials Connection pool
// Lazy-initialized on the first query request to survive offline settings
let pool = null;

function getDbPool() {
    if (!pool) {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'unpad_merch_hub',
            port: parseInt(process.env.DB_PORT || '3306'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };

        console.log(`[MYSQL] Initializing connection pool targeting: ${config.host}:${config.port}/${config.database}`);
        pool = mysql.createPool(config);
    }
    return pool;
}

// Check database connection API
app.get('/api/db-check', async (req, res) => {
    try {
        const db = getDbPool();
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        return res.json({ 
            status: 'connected', 
            message: 'Koneksi ke database MySQL berhasil!', 
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'unpad_merch_hub'
        });
    } catch (err) {
        console.error('[MYSQL ERROR]', err);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Gagal terhubung ke MySQL: ' + err.message 
        });
    }
});

// ================================================
// 1. AUTHENTICATION (LOGIN & REGISTRATION)
// ================================================

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, role } = req.body;
    if (!email || !role) {
        return res.status(400).json({ status: 'error', message: 'Email dan role wajib diisi' });
    }

    try {
        const db = getDbPool();
        const [users] = await db.query(
            'SELECT * FROM users WHERE LOWER(email) = ? AND role = ?', 
            [email.trim().toLowerCase(), role]
        );

        if (users.length > 0) {
            console.log(`[MYSQL AUTH] Login Successful for: ${email}`);
            return res.json({ 
                status: 'success', 
                message: 'Login Berhasil', 
                user: users[0] 
            });
        } else {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Email salah atau peran tidak sesuai!' 
            });
        }
    } catch (err) {
        console.error('[MYSQL AUTH ERROR]', err);
        return res.status(500).json({ status: 'error', message: 'Kegagalan query login: ' + err.message });
    }
});

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, role } = req.body;
    if (!fullName || !email || !role) {
        return res.status(400).json({ status: 'error', message: 'Semua kolom wajib diisi!' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    try {
        const db = getDbPool();
        // Check duplicate email
        const [existing] = await db.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
        if (existing.length > 0) {
            return res.status(400).json({ status: 'error', message: 'E-mail sudah terdaftar di database MySQL!' });
        }

        const newUserId = 'USR-' + Date.now();
        await db.query(
            'INSERT INTO users (id, fullName, email, role) VALUES (?, ?, ?, ?)',
            [newUserId, cleanName, cleanEmail, role]
        );

        // Fetch freshly created user
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [newUserId]);
        
        // Add welcome notification
        const welcomeNtfId = 'NTF-' + Date.now();
        const ntfMsg = `Halo ${cleanName}, selamat bergabung di hub merchandise kebanggaan Unpad via database MySQL.`;
        await db.query(
            'INSERT INTO notifications (id, userId, title, message, isRead, orderId) VALUES (?, ?, ?, ?, 0, NULL)',
            [welcomeNtfId, newUserId, 'Akun Baru Dibuat', ntfMsg]
        );

        console.log(`[MYSQL AUTH] Registrasi Berhasil untuk: ${cleanEmail}`);
        return res.json({ 
            status: 'success', 
            message: 'Pendaftaran Berhasil!', 
            user: users[0] 
        });
    } catch (err) {
        console.error('[MYSQL REGISTRATION ERROR]', err);
        return res.status(500).json({ status: 'error', message: 'Gagal membuat akun: ' + err.message });
    }
});


// ================================================
// 2. DISCOVER & FEED RESOURCES (PRODUCTS/CATEGORIES)
// ================================================

// Categories list
app.get('/api/categories', async (req, res) => {
    try {
        const db = getDbPool();
        const [categories] = await db.query('SELECT * FROM categories ORDER BY id ASC');
        return res.json(categories);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Products list
app.get('/api/products', async (req, res) => {
    try {
        const db = getDbPool();
        const [products] = await db.query('SELECT * FROM products ORDER BY id DESC');
        return res.json(products);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Create product (Admin)
app.post('/api/products', async (req, res) => {
    const { categoryId, productName, description, price, stock, image } = req.body;
    try {
        const db = getDbPool();
        const newPrdId = 'PRD-' + Date.now();
        await db.query(
            'INSERT INTO products (id, categoryId, productName, description, price, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [newPrdId, categoryId, productName, description, price, stock, image]
        );
        const [result] = await db.query('SELECT * FROM products WHERE id = ?', [newPrdId]);
        return res.json(result[0]);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


// ================================================
// 3. TRANSACTIONS MANAGEMENT (ORDERS & HISTORY)
// ================================================

// Read order history for specific user
app.get('/api/orders', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
        const db = getDbPool();
        // Load orders
        const [orders] = await db.query('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
        
        // Populate nested items
        for (const order of orders) {
            const [items] = await db.query('SELECT * FROM order_items WHERE orderId = ?', [order.id]);
            order.items = items;
        }

        return res.json(orders);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Create Order (Checkout)
app.post('/api/orders', async (req, res) => {
    const { userId, items, totalAmount } = req.body; // items is array of { productId, quantity, price }
    if (!userId || !items || !items.length) {
        return res.status(400).json({ error: 'Data pesanan tidak lengkap.' });
    }

    try {
        const db = getDbPool();
        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

        // Transaction handling
        await db.query('START TRANSACTION');

        // Check and update stocks
        for (const item of items) {
            const [prdRows] = await db.query('SELECT stock, productName FROM products WHERE id = ?', [item.productId]);
            if (prdRows.length === 0 || prdRows[0].stock < item.quantity) {
                await db.query('ROLLBACK');
                return res.status(400).json({ error: `Stok barang "${prdRows[0]?.productName || 'tidak dikenal'}" tidak mencukupi.` });
            }
            // Subtract stock
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
        }

        // Insert Order main
        await db.query(
            'INSERT INTO orders (id, userId, totalAmount, paymentStatus, orderStatus) VALUES (?, ?, ?, "Pending", "Pending Payment")',
            [orderId, userId, totalAmount]
        );

        // Insert order items
        for (let idx = 0; idx < items.length; idx++) {
            const item = items[idx];
            const itemJoinId = `ORI-${Date.now()}-${idx}`;
            await db.query(
                'INSERT INTO order_items (id, orderId, productId, quantity, price) VALUES (?, ?, ?, ?, ?)',
                [itemJoinId, orderId, item.productId, item.quantity, item.price]
            );
        }

        await db.query('COMMIT');
        return res.json({ success: true, orderId, totalAmount });
    } catch (err) {
        const db = getDbPool();
        await db.query('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: 'Gagal melakukan transaksi: ' + err.message });
    }
});


// ================================================
// 4. ALERTS & REALTIME COMPONENT (NOTIFICATIONS)
// ================================================

// Load user notifications
app.get('/api/notifications', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
        const db = getDbPool();
        const [notifications] = await db.query('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC', [userId]);
        return res.json(notifications);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Serve Frontend app static files in production
const distDir = path.join(process.cwd(), 'dist');
app.use(express.static(distDir));

// Keep health check
app.get('/status', (req, res) => {
    res.json({ server: 'alive', framework: 'express', db: 'mysql' });
});

// Catch-all to support SPA React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

// Launch listening
app.listen(PORT, '0.0.0.0', () => {
    console.log(`===================================================`);
    console.log(` UNPAD MERCH HUB BACKEND RUNNING ON PORT ${PORT}`);
    console.log(` MySQL ready interface standard enabled on /api/`);
    console.log(`===================================================`);
});
