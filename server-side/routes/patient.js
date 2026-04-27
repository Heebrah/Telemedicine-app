const express = require('express');
const router = express.Router();
const db = require('../database');
const { verifyToken } = require('../middleware/auth');
const { getAllPatients, createPatient, updatePatient, deletePatient, loginPatient, getProfile } = require('../controller/patientController');
// Get all patients


router.get('/patients', getAllPatients);
router.post('/patients/login', loginPatient);
router.get('/patients/profile', verifyToken, getProfile);
// router.get('/patients/:id', verifyToken, getPatientById);
router.post('/patients',verifyToken, createPatient);
router.patch('/patients/:id', verifyToken, updatePatient);
router.delete('/patients/:id', verifyToken, deletePatient);

module.exports = router;