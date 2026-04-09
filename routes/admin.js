const express = require('express');
const router = express.Router();



const { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, loginAdmin, logoutAdmin, getProfile } = require('../controller/adminController');
const { verifyToken } = require('../middleware/auth');



// Auth routes
router.post('/admins/login', loginAdmin);
router.post('/admins/logout', verifyToken, logoutAdmin);

// Admin CRUD routes
router.get('/admins/', verifyToken, getAllAdmins);          // GET /api/admins
router.get('/admins/:id', verifyToken, getAdminById);      // GET /api/admins/:id
router.post('/admins', verifyToken, createAdmin);         // POST /api/admins
router.put('/admins/:id', verifyToken, updateAdmin);       // PUT /api/admins/:id
router.delete('/admins/:id', verifyToken, deleteAdmin);    // DELETE /api/admins/:id
router.get('/admins/profile', verifyToken, getProfile);


module.exports = router;