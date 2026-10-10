# Employee Database Management System

React (frontend) + Node/Express (backend) + SQLite (SQL database)

## How to run (needs Node.js installed)

Open **two** terminals.

**Terminal 1 – backend**
```
cd backend
npm install
npm start
```
→ Backend running at http://localhost:5000

**Terminal 2 – frontend**
```
cd frontend
npm install
npm run dev
```
→ Open http://localhost:5173 in the browser

## How it works

1. **Frontend (`frontend/src/App.jsx`)** – form takes Name, ID, Designation, Basic Salary, City, Present Days and sends them to the backend.
2. **Backend (`backend/server.js`)** – calculates PF, HRA, DA, Total Salary and Bus Fees, then saves everything in the database.
3. **Database (`backend/employees.db`)** – SQLite file, created automatically. Table structure is in `backend/schema.sql`.

## Formulas

| Designation | PF | HRA | DA |
|---|---|---|---|
| Developer | 6% | 10% | 40% |
| Tester | 6% | 10% | 35% |
| TeamLead | 8% | 15% | 50% |
| Manager | 8% | 20% | 60% |

```
PF  = Basic × PF%
HRA = Basic × HRA%
DA  = Basic × DA%
Total Salary = (Basic + HRA + DA − PF) ÷ 30 × Present Days
```

| City | Bus Fees |
|---|---|
| Gudur | 10000 |
| Nellore | 20000 |
| Kota | 6000 |
| Naidupeta | 15000 |

## Example

Suresh, 001, Developer, Basic 10000, Gudur, 30 days

- PF = 600, HRA = 1000, DA = 4000
- Total Salary = 10000 + 1000 + 4000 − 600 = **14400**
- Bus Fees = **10000**
