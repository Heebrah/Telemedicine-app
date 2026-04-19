const express = require('express');
const router = express.Router();



const { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, loginAdmin, logoutAdmin, getProfile } = require('../controller/adminController');
const { verifyToken } = require('../middleware/auth');



// Auth routes
router.post('/admins/login', loginAdmin);


// Admin CRUD routes
router.get('/admins/profile', verifyToken, getProfile);
router.get('/admins/:id', verifyToken, getAdminById);
router.get('/admins/', getAllAdmins);          // GET /api/admins
router.get('/admins/:id', verifyToken, getAdminById);      // GET /api/admins/:id
router.post('/admins', verifyToken, createAdmin);         // POST /api/admins
      // PUT /api/admins/:id
router.delete('/admins/:id', verifyToken, deleteAdmin);    // DELETE /api/admins/:id

module.exports = router;