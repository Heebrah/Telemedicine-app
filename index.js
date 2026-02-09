const express = require('express')

const db = require('./database')

const app = express();

const port = 3500
const bcrypt = require('bcryptjs')

app.use(express.json())


app.get('/', (req, res) =>{
  let myDb = 'Select * from admission'
  db.query(myDb, function(err, result) {
      if (err) throw err;
      res.send(result)
  })
  // res.send('Hello, you are now using express package.')
})



app.get('/createTable', (req, res) =>{
  const sql = `
  CREATE TABLE IF NOT EXISTS patients(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )
  `
  
  db.query(sql, (err, result) =>{
    if(err){
      console.log('Error creating users', err)
      return response.status(500).send('Error creating users')
    }
    res.send(result)
  })
})

// 

app.get('/createUser', (req, res) =>{
  const sql = `
  INSERT INTO users (name, email) VALUES ('Eddy', 'eddy09@gmail.com')`

  db.query(sql, (err) =>{
    if(err){
      console.log('Error creating users', err)
      return response.status(500).send('Error creating users')
    }
    res.send('user are created successfully')
  })
}
  
)


  app.get('/patient', (req, res)=>{
   
    const sql = `SELECT * FROM patients`
  
    db.query(sql, (err, results) =>{
      if(err){
        console.log('Error fetching patients', err)
        return response.status(500).send('Error fetching patients')
      }
      res.send(results)
    })
  })


 app.post('/addDoctor', (req, res) => {
  const { first_name, last_name, password, specialisation, phone, schedule } = req.body
const password_hash = bcrypt.hashSync(password, 3)
  const sql = `
    INSERT INTO doctors 
    (first_name, last_name, password_hash, specialisation, phone, \`schedule\`)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  

  db.query(
    sql,
    [first_name, last_name, password_hash, specialisation, phone, schedule],
    (err) => {
      if (err) {
        console.error('Error creating doctor:', err)
        return res.status(500).send('Error creating doctor')
      }
      res.send('Doctor added successfully')
    }
  )
})


app.get('/doctors', (req, res)=>{
  const sql = `SELECT * FROM doctors`

 
   // give me the list of doctors in the database and display it on the browser
    db.query(sql, (err, results) => {
      if(err){
        console.log('Error fetching doctors', err)
        return response.status(500).send('Error fetching doctors')
      }
      res.send(results)
    })
  })


app.get('/appointments', (req, res)=>{
  const sql = `SELECT * FROM appointments`

  db.query(sql, (err) =>{
    if(err){
      console.log('Error creating users', err)
      return response.status(500).send('Error creating users')
    }
    res.send('appointments selected')
  })
})


app.get('/admin', (req, res)=>{
  const sql = `SELECT * FROM admin`

  db.query(sql, (err) =>{
    if(err){
      console.log('Error creating users', err)
      return response.status(500).send('Error creating users')
    }
    res.send('admin selected')
  })
})


app.listen(port, ()=>{
  console.log(`Server is running on http://localhost:${port}`)
})


// function patients(){
//   app.get('/createTable', (req, res) =>{
//     const sql = `
//     CREATE TABLE IF NOT EXISTS patients(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(40) NOT NULL,
//     email VARCHAR(45) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )
//     `
//     db.query(sql, (err) =>{
//       if(err){
//         console.log('Error creating users', err)
//         return response.status(500).send('Error creating users')
//       }
//       res.send('users table created successfully')
//     })
//   })
// }