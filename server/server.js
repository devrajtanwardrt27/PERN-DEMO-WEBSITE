require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "taskdb",
  password: process.env.PGPASSWORD || "password",
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  );
`).catch(err => {
  console.error("Error creating tasks table:", err.message);
});

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/tasks failed:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/tasks failed:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT id FROM tasks WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(`DELETE /api/tasks/${req.params.id} failed:`, err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/", (req, res) => {
  res.send("PERN Task Manager API is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});