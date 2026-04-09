const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcryptjs')
const session = require('express-session');
const middleware = require('../middleware/auth');
const SECRET = process.env.SESSION_SECRET || 'your_secret_key';

const jwt = require('jsonwebtoken');






module.exports.getAllAdmins = (req, res) => {
  const sql = 'SELECT id, username, role FROM admins';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching admins: ', err);
      return res.status(500).json({ error: 'Failed to fetch admins' });
    }
    res.json(results);
  }); 
}

module.exports.getAdminById = (req, res) => {
  const sql = 'SELECT id, username, role FROM admins WHERE id = ?';
  const adminId = req.params.id;
  db.query(sql, [adminId], (err, results) => {
    if (err) {
      console.error('Error fetching admin: ', err);
      return res.status(500).json({ error: 'Failed to fetch admin' });
    } else if (results.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    } 
    res.json(results[0]);
  });
}

module.exports.createAdmin = (req, res) => {
  const { username, role, password } = req.body;
  const password_hash = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO admins (username, role, password_hash) VALUES (?, ?, ?)';

  if(!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  else if (role && !['superadmin', 'editor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be "superadmin" or "editor"' });
  }

  else if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  else if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const checkSql = 'SELECT id FROM admins WHERE username = ?';
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('Error checking admin: ', err);
      return res.status(500).json({ error: 'Failed to check admin' });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
  });
  
  db.query(sql, [username, role, password_hash], (err, result) => {
    if (err) {  
      console.error('Error creating admin: ', err);
      return res.status(500).json({ error: 'Failed to create admin' });
    } 
    res.status(201).json({ id: result.insertId, username, role: role || 'editor' });
  });
}

module.exports.updateAdmin = (req, res) => {
  const adminId = req.params.id;
  const { username, role } = req.body;
  
  const sql = 'UPDATE admins SET username = ?, role = ?,  WHERE id = ?';
  db.query(sql, [username, role,, adminId], (err, result) => {  
    if (err) {
      console.error('Error updating admin: ', err);
      return res.status(500).json({ error: 'Failed to update admin' });
    }
    else if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    } 
    res.json({ id: adminId, username, role: role || 'editor' });
  });  
}

module.exports.deleteAdmin = (req, res) => {
  const adminId = req.params.id;
  const sql = 'DELETE FROM admins WHERE id = ?';
  db.query(sql, [adminId], (err, result) => {
    if (err) {
      console.error('Error deleting admin: ', err); 
      return res.status(500).json({ error: 'Failed to delete admin' });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    } 
    res.json({ message: 'Admin deleted successfully' });
  });
}

module.exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM admins WHERE username = ?';

  db.query(sql, [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!result.length) return res.status(400).json({ message: 'Invalid credentials' });

    const admin = result[0];

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ CREATE TOKEN
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token
    });
  });
};

module.exports.logoutAdmin = (req, res) => {
  // For JWT, logout is handled on the client by deleting the token
  res.json({ message: 'Logged out successfully' });
};


module.exports.getProfile = (req, res) => {
  const adminId = req.admin.id;
  const sql = 'SELECT id, username, role FROM admins WHERE id = ?';
  db.query(sql, [adminId], (err, results) => {
    if (err) {
      console.error('Error fetching admin profile: ', err);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    } 
    res.json(results[0]);
  });
}