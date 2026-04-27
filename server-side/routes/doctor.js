const express = require('express');
const router = express.Router();
const db = require('../database');
const { getAllDoctor, getDoctorById, createDoctor, loginDoctor, getProfile, updateDoctor, deleteDoctor } = require('../controller/doctorController')
const { verifyToken } = require('../middleware/auth')

router.get('/doctors', getAllDoctor)
router.get('/doctors/profile', verifyToken, getProfile)
router.get('/doctors/:id',  getDoctorById)
router.post('/doctors', createDoctor)
router.post('/doctors/login', loginDoctor)
router.patch('/doctors/:id', verifyToken, updateDoctor)
router.delete('/doctors/:id', verifyToken, deleteDoctor)


module.exports = router