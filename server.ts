import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("finance.db");
db.pragma('foreign_keys = ON');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    description TEXT,
    category TEXT,
    amount REAL,
    currency TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS loans_given (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    name TEXT,
    amount REAL,
    expected_date TEXT,
    status TEXT DEFAULT 'Pending',
    return_date TEXT,
    currency TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS loans_taken (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    name TEXT,
    amount REAL,
    return_date TEXT,
    status TEXT DEFAULT 'Pending',
    currency TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/signup", (req, res) => {
    const { email, password, name } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, password, name);
      res.json({ success: true, user: { id: info.lastInsertRowid, email, name } });
    } catch (e) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }
  });

  app.get("/api/auth/verify/:userId", (req, res) => {
    const user = db.prepare("SELECT id FROM users WHERE id = ?").get(req.params.userId);
    if (user) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "User not found" });
    }
  });

  // Expenses
  app.get("/api/expenses/:userId", (req, res) => {
    const expenses = db.prepare("SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC").all(req.params.userId);
    res.json(expenses);
  });

  app.post("/api/expenses", (req, res) => {
    const { user_id, date, description, category, amount, currency } = req.body;
    try {
      db.prepare("INSERT INTO expenses (user_id, date, description, category, amount, currency) VALUES (?, ?, ?, ?, ?, ?)").run(user_id, date, description, category, amount, currency);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(401).json({ success: false, message: "User session invalid" });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  });

  // Loans Given
  app.get("/api/loans-given/:userId", (req, res) => {
    const loans = db.prepare("SELECT * FROM loans_given WHERE user_id = ? ORDER BY date DESC").all(req.params.userId);
    res.json(loans);
  });

  app.post("/api/loans-given", (req, res) => {
    const { user_id, date, name, amount, expected_date, currency } = req.body;
    try {
      db.prepare("INSERT INTO loans_given (user_id, date, name, amount, expected_date, currency) VALUES (?, ?, ?, ?, ?, ?)").run(user_id, date, name, amount, expected_date, currency);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(401).json({ success: false, message: "User session invalid" });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  });

  app.patch("/api/loans-given/:id", (req, res) => {
    const { status, return_date } = req.body;
    db.prepare("UPDATE loans_given SET status = ?, return_date = ? WHERE id = ?").run(status, return_date, req.params.id);
    res.json({ success: true });
  });

  // Loans Taken
  app.get("/api/loans-taken/:userId", (req, res) => {
    const loans = db.prepare("SELECT * FROM loans_taken WHERE user_id = ? ORDER BY date DESC").all(req.params.userId);
    res.json(loans);
  });

  app.post("/api/loans-taken", (req, res) => {
    const { user_id, date, name, amount, return_date, currency } = req.body;
    try {
      db.prepare("INSERT INTO loans_taken (user_id, date, name, amount, return_date, currency) VALUES (?, ?, ?, ?, ?, ?)").run(user_id, date, name, amount, return_date, currency);
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        res.status(401).json({ success: false, message: "User session invalid" });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  });

  app.patch("/api/loans-taken/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE loans_taken SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Dashboard Stats
  app.get("/api/stats/:userId", (req, res) => {
    const userId = req.params.userId;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const monthlyExpenses = db.prepare(`
      SELECT currency, SUM(amount) as total 
      FROM expenses 
      WHERE user_id = ? AND date LIKE ? 
      GROUP BY currency
    `).all(userId, `${currentMonth}%`);

    const pendingLoansGiven = db.prepare(`
      SELECT currency, SUM(amount) as total 
      FROM loans_given 
      WHERE user_id = ? AND status = 'Pending'
      GROUP BY currency
    `).all(userId);

    const pendingLoansTaken = db.prepare(`
      SELECT currency, SUM(amount) as total 
      FROM loans_taken 
      WHERE user_id = ? AND status = 'Pending'
      GROUP BY currency
    `).all(userId);

    res.json({
      monthlyExpenses,
      pendingLoansGiven,
      pendingLoansTaken
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
