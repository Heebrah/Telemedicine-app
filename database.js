// import package
const mysql = require('mysql2')
require('dotenv').config()



const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0 
});




db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
  }
});


module.exports = db;

  // CREATE DATABASE note_app;
  // USE note_app;

  // CREATE TABLE notes(
  // id integer PRIMARY KEY AUTO_INCREMENT,
  // tittle VARCHAR(255) NOT NULL,
  // contents TEXT NOT NULL,
  // created TIMESTAMP NOT NULL DEFAULT NOW()
  // );

  // INSERT INTO notes (title, contents)
  // VALUES
  // ('My First Note', 'A note about something'),
  // ('My Second Note', 'A note about something else')