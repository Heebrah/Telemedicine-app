 const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs');
const e = require('express');

module.exports.getAllDoctor = (req, res) => {
  const sql = 'SELECT * FROM doctors';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching Doctors: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    } });
}

module.exports.getDoctorById = (req, res)=>{
  const sql = 'SELECT id, first_name, last_name, specialization, phone, schedule, email FROM doctors WHERE id = ?';
  const doctorId = req.params.id
  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching Doctor: ', err);
      return res.status(500).json({ error: 'Database error' });
    } 
  
      res.json(results[0]);
    });
}



module.exports.createDoctor = (req, res) => {
  const { first_name, last_name, email, password, specialization, phone, schedule } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const checkSql = 'SELECT * FROM doctors WHERE email = ?';

  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error('Error checking doctor: ', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Doctor with this email already exists' });
    }

    // hash AFTER validation
    const password_hash = bcrypt.hashSync(password, 10);

    const insertSql = `
      INSERT INTO doctors 
      (first_name, last_name, email, password_hash, specialization, phone, schedule) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [first_name, last_name, email, password_hash, specialization, phone, schedule],
      (err, result) => {
        if (err) {
          console.error('Error creating doctor: ', err);
          return res.status(500).json({ error: 'Database error' });
        }

        return res.json({ success: true, doctorId: result.insertId });
      }
    );
  });
};



// login doctor
module.exports.loginDoctor = (req, res) => {
  const { email, password } = req.body
  // check if doctor with the email exists
  const sql = 'SELECT * FROM doctors WHERE email = ?'
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching doctor: ', err)
      return res.status(500).json({ error: 'Database error' })
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const doctor = results[0]
    // compare password
    const isPasswordValid = bcrypt.compareSync(password, doctor.password_hash)  
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    } else {
      res.json({ success: true, doctor: { id: doctor.id, first_name: doctor.first_name, last_name: doctor.last_name, email: doctor.email, specialisation: doctor.specialisation, phone: doctor.phone, schedule: doctor.schedule } })
    } })
}