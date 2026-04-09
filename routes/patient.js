const express = require('express');
const router = express.Router();
const db = require('../database');
const { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient, loginPatient } = require('../controller/patientController');
// Get all patients
router.get('/patients', getAllPatients);

// Get a patient by ID
router.get('/patients/:id', getPatientById);

// Login a patient
router.post('/patients/login', loginPatient);

// Create a new patient
router.post('/patients', createPatient);


// Update a patient by ID
router.patch('/patients/:id', updatePatient);

// Delete a patient by ID
router.delete('/patients/:id', deletePatient);

module.exports = router;