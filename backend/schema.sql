-- SQL table used by the app (server.js creates it automatically).
-- Shown here separately so it's easy to explain / submit.

CREATE TABLE IF NOT EXISTS employees (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  designation   TEXT NOT NULL,      -- Developer / Tester / TeamLead / Manager
  basic_salary  REAL NOT NULL,
  city          TEXT NOT NULL,      -- Gudur / Nellore / Kota / Naidupeta
  present_days  INTEGER NOT NULL,
  pf            REAL,
  hra           REAL,
  da            REAL,
  total_salary  REAL,
  bus_fees      REAL
);

-- Example row (Suresh, Developer, 10000, Gudur, 30 days)
-- pf = 600, hra = 1000, da = 4000
-- total_salary = 10000 + 1000 + 4000 - 600 = 14400
-- bus_fees = 10000
INSERT INTO employees VALUES
('001', 'Suresh', 'Developer', 10000, 'Gudur', 30, 600, 1000, 4000, 14400, 10000);

-- Useful queries
SELECT * FROM employees;
SELECT name, total_salary FROM employees WHERE designation = 'Manager';