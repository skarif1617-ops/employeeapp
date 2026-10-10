// ===============================================
//  Employee Database Management System - BACKEND
//  Express (API server) + SQLite (SQL database)
// ===============================================
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());          // allow React (port 5173) to call this server (port 5000)
app.use(express.json());  // read JSON sent from the frontend

// ---------- 1. DATABASE ----------
// Creates a file "employees.db" in this folder (no MySQL install needed)
const db = new Database("employees.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    designation   TEXT NOT NULL,
    basic_salary  REAL NOT NULL,
    city          TEXT NOT NULL,
    present_days  INTEGER NOT NULL,
    pf            REAL,
    hra           REAL,
    da            REAL,
    total_salary  REAL,
    bus_fees      REAL
  )
`);

// ---------- 2. RULES (from the task) ----------
// Percentages based on designation
const RATES = {
  Developer: { pf: 6, hra: 10, da: 40 },
  Tester:    { pf: 6, hra: 10, da: 35 },
  TeamLead:  { pf: 8, hra: 15, da: 50 },
  Manager:   { pf: 8, hra: 20, da: 60 },
};

// Bus fees based on city
const BUS_FEES = {
  Gudur: 10000,
  Nellore: 20000,
  Kota: 6000,
  Naidupeta: 15000,
};

// ---------- 3. CALCULATION ----------
function calculateSalary(designation, basic, presentDays, city) {
  const rate = RATES[designation];

  const pf  = (basic * rate.pf)  / 100;
  const hra = (basic * rate.hra) / 100;
  const da  = (basic * rate.da)  / 100;

  // Full month salary = Basic + HRA + DA - PF
  const monthSalary = basic + hra + da - pf;

  // Paid only for days present (month = 30 days)
  const total_salary = Math.round((monthSalary / 30) * presentDays);

  const bus_fees = BUS_FEES[city];

  return { pf, hra, da, total_salary, bus_fees };
}

// ---------- 4. API ROUTES ----------

// Add a new employee
app.post("/api/employees", (req, res) => {
  const { id, name, designation, basic_salary, city, present_days } = req.body;

  // simple validation
  if (!id || !name || !RATES[designation] || !BUS_FEES[city]) {
    return res.status(400).json({ error: "Please fill all fields correctly" });
  }
  if (present_days < 0 || present_days > 30) {
    return res.status(400).json({ error: "Present days must be between 0 and 30" });
  }

  const basic = Number(basic_salary);
  const days = Number(present_days);
  const result = calculateSalary(designation, basic, days, city);

  try {
    db.prepare(`
      INSERT INTO employees
        (id, name, designation, basic_salary, city, present_days, pf, hra, da, total_salary, bus_fees)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, designation, basic, city, days,
           result.pf, result.hra, result.da, result.total_salary, result.bus_fees);

    res.json({ message: "Employee saved", employee: { id, name, designation, basic_salary: basic, city, present_days: days, ...result } });
  } catch (err) {
    res.status(400).json({ error: "Employee ID already exists" });
  }
});

// Get all employees
app.get("/api/employees", (req, res) => {
  const rows = db.prepare("SELECT * FROM employees").all();
  res.json(rows);
});

// Delete an employee
app.delete("/api/employees/:id", (req, res) => {
  db.prepare("DELETE FROM employees WHERE id = ?").run(req.params.id);
  res.json({ message: "Employee deleted" });
});

app.listen(5000, () => console.log("Backend running at http://localhost:5000"));