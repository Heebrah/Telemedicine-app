const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs')


// Create Appointment
module.exports.createAppointment = (req, res) => {

  const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;

  const sql = `
    INSERT INTO appointments 
    (patient_id, doctor_id, appointment_date, appointment_time, status) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [patient_id, doctor_id, appointment_date, appointment_time, status || 'pending'],
    (err, result) => {

      if (err) {
        console.error('Error creating appointment: ', err);
        return res.status(500).json({ 
          success: false,
          message: 'Database error'
        });
      }

      res.status(201).json({
        success: true,   // ✅ IMPORTANT
        message: 'Appointment created',
        data: {
          id: result.insertId,
          patient_id,
          doctor_id,
          appointment_date,
          appointment_time,
          status: status || 'pending'
        }
      });
    }
  );
};

// Get Appointments
module.exports.getAppointments = (req, res) => {
    const sql = 'SELECT a.id, p.first_name AS patient_first_name, p.last_name AS patient_last_name, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, a.appointment_date, a.appointment_time, a.status FROM appointments a JOIN patients p ON a.patient_id = p.id JOIN doctors d ON a.doctor_id = d.id';  
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching appointments: ', err);
            return res.status(500).json({ error: 'Database error' });
        } else {
            res.json({length: results.length, appointments: results });
        } 
    });
};

// Update Appointment Status
module.exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = 'UPDATE appointments SET status = ? WHERE id = ?';

  db.query(sql, [status, id], (err, result) => {  
    if (err) {
      console.error('Error updating appointment status: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    } else {
      res.json({ id, status });
    }
  });
}


// Delete Appointment
module.exports.deleteAppointment =  (req, res) => {
  try {
    const { id } = req.params;

     db.query(`DELETE FROM appointments WHERE id = ?`, [id]);

    res.json({ message: "Appointment deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getAppointmentsByDoctor = (req, res) => {
  const doctorId = req.params.doctorId;
  const sql = 'SELECT a.id, p.first_name AS patient_first_name, p.last_name AS patient_last_name, a.appointment_date, a.appointment_time, a.status FROM appointments a JOIN patients p ON a.patient_id = p.id WHERE a.doctor_id = ?';
  db.query(sql, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching appointments: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      res.json({length: results.length, appointments: results });
    }
  });
}

module.exports.getAppointmentsByPatient = (req, res) => {
  const patientId = req.params.patientId;
  const sql = 'SELECT a.id, d.first_name AS doctor_first_name, d.last_name AS doctor_last_name, a.appointment_date, a.appointment_time, a.status FROM appointments a JOIN doctors d ON a.doctor_id = d.id WHERE a.patient_id = ?';
  db.query(sql, [patientId], (err, results) => {
    if (err) {
      console.error('Error fetching appointments: ', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      res.json({length: results.length, appointments: results });
    }
  });
}

