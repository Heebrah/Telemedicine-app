const express = require('express');
const router = express.Router();
const db = require('../database');
const { getAppointments, createAppointment, updateStatus, deleteAppointment, getAppointmentsByDoctor, getAppointmentsByPatient} = require('../controller/appointmentController')

router.post('/appointments', createAppointment);
router.get('/appointments', getAppointments);
router.patch('/appointments/:id', updateStatus);
router.delete('/appointments/:id', deleteAppointment);
router.get('/doctors/:doctorId/appointments', getAppointmentsByDoctor);
router.get('/patients/:patientId/appointments', getAppointmentsByPatient);

module.exports = router;