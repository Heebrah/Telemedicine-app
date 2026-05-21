const express = require('express');
const cors = require('cors');
const db = require('./database');
const { verifyToken } = require('./middleware/auth');

const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');
const adminRoutes = require('./routes/admin');

const app = express();
const port = 3500;

// ------------------------
// Middleware
app.use((req, res, next) => { req.verifyToken = verifyToken; next(); });

// CORS: allow your frontend origin with credentials


const allowedOrigins = [
  'http://127.0.0.1:5500',
  'https://telemedicine-mwpehltqv-ibrahim-techie.vercel.app',
  'https://telemedicine-oaq3lp31a-ibrahim-techie.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy blocked this origin.'), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (must come BEFORE routes)

// ------------------------
// Routes
// ------------------------
app.use('/api', patientRoutes);
app.use('/api', doctorRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', adminRoutes);

// -----------------------
// Test root endpoint
// ------------------------
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ------------------------
// Example table creation endpoints (optional)
// ------------------------
// app.get('/createTable', (req, res) => {
//   const sql = `
//     CREATE TABLE IF NOT EXISTS patients(
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(40) NOT NULL,
//       email VARCHAR(45) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;
//   db.query(sql, (err, result) => {
//     if (err) return res.status(500).send('Error creating patients table');
//     res.send('Patients table created');
//   });
// });

app.listen(port, () => {
  console.log(`check your localhost at http://localhost:${port}`);
});