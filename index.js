const express = require('express')

const db = require('./database')

const app = express();

const port = 3500

// app.get('/', (req, res) =>{
//   let myDb = 'Select * from admissions'
//   db.query(myDb, function(err, result) {
//       if (err) throw err;
//       res.send(result)
//   })
//   // res.send('Hello, you are now using express package.')
// })

app.get('/', (req, res) =>{
  res.send('welcome page')
})

app.get('/createTable', (req, res) =>{
  const sql = `
  CREATE TABLE IF NOT EXISTS patients(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  email VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )
  `
  db.query(sql, (err) =>{
    if(err){
      console.log('Error creating users', err)
      return response.status(500).send('Error creating users')
    }
    res.send('users table created successfully')
  })
})

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
  
    db.query(sql, (err) =>{
      if(err){
        console.log('Error creating users', err)
        return response.status(500).send('Error creating users')
      }
      res.send(`<input type='text' placeholder='input your name' />`)
    })
  })



app.get('/doctors', (req, res)=>{
  const sql = `SELECT * FROM doctors`

  db.query(sql, (err) =>{
    if(err){
      console.log('Error creating users', err)
      return response.status(500).send('Error creating users')
    }
    res.send('doctors selected')
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