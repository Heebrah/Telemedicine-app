const express = require('express');
const router = express.Router();
const db = require('../database');
const { getAppointments, createAppointment, updateStatus, deleteAppointment} = require('../controller/appointmentController')

router.post('/appointments', createAppointment);
router.get('/appointments', getAppointments);
router.patch('/appointments/:id/status', updateStatus);
router.delete('/appointments/:id', deleteAppointment);

module.exports = router;