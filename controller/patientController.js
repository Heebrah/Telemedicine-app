 const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs')
const SECRET = process.env.SESSION_SECRET || 'your_secret_key';

const jwt = require('jsonwebtoken');

module.exports.getAllPatients = (req, res) => {
  const sql = 'SELECT id, first_name, last_name, email, phone, date_of_birth, gender, address  FROM patients';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching patients: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      res.json({success: true, length: results.length, patients: results });
    } });
}

// Get a patient by ID
module.exports.getPatientById = (req, res) => {
  const sql = 'SELECT id, first_name, last_name, email, phone, date_of_birth, gender, address FROM patients WHERE id = ?'; 
  const patientId = req.params.id;
  db.query(sql, [patientId], (err, results) => {
    if (err) {  
      console.error('Error fetching patient: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    } else {
      res.json(results[0]);
    }
  });
}

module.exports.createPatient = (req, res) => {
  const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

  // 1. Check if email already exists
  const checkSql = 'SELECT id FROM patients WHERE email = ?';

  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error('Error checking email: ', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // 2. Insert if not exists
    const password_hash = bcrypt.hashSync(password, 10);

    const insertSql = `
      INSERT INTO patients 
      (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address],
      (err, result) => {
        if (err) {
          console.error('Error creating patient: ', err);
          return res.status(500).json({ error: 'Database error' });
        }

        res.status(201).json({
          success: true,
          id: result.insertId
        });
      }
    );
  });
};

module.exports.updatePatient = (req, res) => {
  const patientId = req.params.id;
  const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;
  const sql = 'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth =  ?, gender = ?, address = ? WHERE id = ?';
  db.query(sql, [first_name, last_name, phone, date_of_birth, gender, address, patientId], (err, result) => {
    if (err) {
      console.error('Error updating patient: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    } else {
      res.json({ id: patientId, first_name, last_name, phone, date_of_birth, gender, address });
    } });
}

module.exports.deletePatient = (req, res) => {
  const patientId = req.params.id;  
  const sql = 'DELETE FROM patients WHERE id = ?';
  db.query(sql, [patientId], (err, result) => {
    if (err) {
      console.error('Error deleting patient: ', err);
      return res.status(500).json({ error: 'Database error' });
    }
    else if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    } else {
      res.json({ message: 'Patient deleted successfully' });
    } });
}

// login
// example login route
module.exports.loginPatient = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM patients WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const patient = result[0];
    const passwordMatch = await bcrypt.compare(password, patient.password_hash);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid email or password' });
  });

  const token = jwt.sign({ id: patient.id, email: patient.email }, SECRET, { expiresIn: '1h' });
  res.json({ token });
}


module.exports.logoutPatient = (req, res) => {
  // For JWT, logout is handled on the client by deleting the token
  res.json({ message: 'Logged out successfully' });
}



