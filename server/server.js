const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// API routes
dbTestRoute();

function dbTestRoute() {
    app.get('/api/test-db', async (req, res) => {
        try {
            const result = await pool.query('SELECT NOW()');
            res.json({ success: true, time: result.rows[0].now });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });
}

app.get('/', (req, res) => {
    res.send('PERN Demo Backend Running!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
