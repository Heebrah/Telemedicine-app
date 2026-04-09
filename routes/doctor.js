const express = require('express');
const router = express.Router();
const db = require('../database');
const { getAllDoctor, getDoctorById, createDoctor, loginDoctor } = require('../controller/doctorController')


router.get('/doctors', getAllDoctor)
router.get('/doctors/:id', getDoctorById)
router.post('/doctors', createDoctor)
router.post('/doctors/login', loginDoctor)




module.exports = router