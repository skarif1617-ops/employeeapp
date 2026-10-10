// ===============================================
//  Employee Database Management System - FRONTEND
//  React: takes input from user, sends to backend,
//  shows the calculated results in a table.
// ===============================================
import React from "react";
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/employees";

const emptyForm = {
  name: "",
  id: "",
  designation: "Developer",
  basic_salary: "",
  city: "Gudur",
  present_days: "",
};

export default function App() {
  const [form, setForm] = useState(emptyForm);   // form input values
  const [employees, setEmployees] = useState([]); // list from database
  const [message, setMessage] = useState("");

  // Load employees when page opens
  useEffect(() => {
    loadEmployees();
  }, []);

  function loadEmployees() {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch(() => setMessage("Backend not running! Start it with: npm start"));
  }

  // Update form when user types
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Send form data to backend
  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage(`Saved ${data.employee.name} — Total Salary: ₹${data.employee.total_salary}`);
      setForm(emptyForm);
      loadEmployees();
    } else {
      setMessage(data.error);
    }
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadEmployees();
  }

  return (
    <div className="container">
      <h1>Employee Database Management System</h1>

      {/* ---------- INPUT FORM ---------- */}
      <form onSubmit={handleSubmit} className="card">
        <h2>Add Employee</h2>

        <label>Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>Employee ID
          <input name="id" value={form.id} onChange={handleChange} required />
        </label>

        <label>Designation
          <select name="designation" value={form.designation} onChange={handleChange}>
            <option>Developer</option>
            <option>Tester</option>
            <option>TeamLead</option>
            <option>Manager</option>
          </select>
        </label>

        <label>Basic Salary
          <input name="basic_salary" type="number" min="0" value={form.basic_salary} onChange={handleChange} required />
        </label>

        <label>City
          <select name="city" value={form.city} onChange={handleChange}>
            <option>Gudur</option>
            <option>Nellore</option>
            <option>Kota</option>
            <option>Naidupeta</option>
          </select>
        </label>

        <label>Present Days
          <input name="present_days" type="number" min="0" max="30" value={form.present_days} onChange={handleChange} required />
        </label>

        <button type="submit">Calculate &amp; Save</button>
        {message && <p className="message">{message}</p>}
      </form>

      {/* ---------- RESULTS TABLE ---------- */}
      <div className="card">
        <h2>Employee Records</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Designation</th><th>Basic</th>
                <th>City</th><th>Days</th><th>PF</th><th>HRA</th><th>DA</th>
                <th>Total Salary</th><th>Bus Fees</th><th></th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 && (
                <tr><td colSpan="12" className="empty">No employees yet</td></tr>
              )}
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.basic_salary}</td>
                  <td>{emp.city}</td>
                  <td>{emp.present_days}</td>
                  <td>{emp.pf}</td>
                  <td>{emp.hra}</td>
                  <td>{emp.da}</td>
                  <td><b>{emp.total_salary}</b></td>
                  <td>{emp.bus_fees}</td>
                  <td><button className="delete" onClick={() => handleDelete(emp.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}