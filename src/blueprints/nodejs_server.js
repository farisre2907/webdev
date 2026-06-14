/**
 * Node.js & Express REST API Server Blueprint for Unpad Merch Hub
 * Compatible with MySQL (mysql2) & PostgreSQL (pg) Database connections
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // For PostgreSQL
// const mysql = require('mysql2/promise'); // Uncomment for MySQL instead

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Establish Database Connection Pool (PostgreSQL version shown below)
const db = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/unpad_merch_hub'
});

// For MySQL replacement, uncomment below:
/*
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unpad_merch_hub',
    waitForConnections: true,
    connectionLimit: 10
});
*/

// Test Connection Endpoint
app.get('/status', async (req, res) => {
    try {
        const dbResult = await db.query('SELECT NOW()'); // Use db.execute('SELECT 1') for MySQL
        res.json({ 
            status: 'success', 
            database: 'PostgreSQL Active', 
            timestamp: dbResult.rows[0].now 
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Authenticate / Login User
app.post('/api/auth/login', async (req, res) => {
    const { email, role } = req.body;
    try {
        const query = 'SELECT id, full_name as "fullName", email, role FROM users WHERE LOWER(email) = $1 AND role = $2';
        const result = await db.query(query, [email.toLowerCase().trim(), role]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Email tidak terdaftar atau peranan tidak sesuai!' });
        }
        
        res.json({ status: 'success', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Register New User
app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, role } = req.body;
    if (!fullName || !email || !role) {
        return res.status(400).json({ status: 'error', message: 'Mohon isi semua kolom data!' });
    }
    
    try {
        const checkQuery = 'SELECT id FROM users WHERE LOWER(email) = $1';
        const checkRes = await db.query(checkQuery, [email.toLowerCase().trim()]);
        if (checkRes.rows.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar!' });
        }
        
        const newUserId = 'USR-' + Date.now();
        const insertQuery = 'INSERT INTO users (id, full_name, email, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name as "fullName", email, role';
        const insertRes = await db.query(insertQuery, [newUserId, fullName, email.toLowerCase().trim(), role]);
        
        res.status(201).json({ status: 'success', user: insertRes.rows[0] });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Retrieve Products
app.get('/api/products', async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.product_name as "productName", p.description, p.price, p.stock, p.image, p.category_id as "categoryId", c.category_name as "categoryName"
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend serverless proxy running on http://0.0.0.0:${PORT}`);
});
