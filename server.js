const express = require('express')
const { Pool } = require('pg')
const path = require('path')
require('dotenv').config()

// dontEnv // para variables de entorno
// https://node-postgres.com/apis/pool

// https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
// docker build --no-cache -t cchavez/node-web-app .
// docker run -p 3000 cchavez/node-web-app

const app = express()
const port = 3000

// para enviar datos por body necesitamos un middleware

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))

const cliente = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// nodemon
app.get('/', (req, res) => {
  // ... codigo arbitrario NODEJS
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'))
})

// ruta para trare todas las peliculas
app.get('/api/v1/movies', (req, res) => {
  // objeto req: la informacion de la peticion
  cliente.connect()
  cliente.query('SELECT * FROM film LIMIT 10;')
    .then(result => {
      return res.status(200).json({ data: result.rows })
    })
    .catch(err => {
      console.log("🚀 ~ file: server.js:48 ~ cliente.query ~ err:", err)
      return res.status(500).json({ error: 'No hay resultados' })
    })    
})


// USANDO QUERY
// ruta con filtros 10 primeros actores
app.get('/api/v1/actors', (req, res) => {
    // console.log(req.query, req.params, req.body, req.method, req.headers)
  const { limit } = req.query
  try {
  cliente.connect()
  cliente.query(`SELECT * FROM actor LIMIT ${limit};`)
    .then(result => {
      console.log("🚀 ~ file: server.js:48 ~ cliente.query ~ result:", result)      
      return res.status(200).json({ data: result.rows })
    })
    .catch(err => {
      console.log("🚀 ~ file: server.js:48 ~ cliente.query ~ err:", err)
      return res.status(500).json({ error: 'No hay resultados' })
    })
    
  } catch (error) {
    console.log({ error })
    return res.status(400).json({ error: 'si se puede'})
  }
  
})


// USANDO PARAMS
// http://localhost:3000/api/v1/country/mex/10
// { country: 'mex', limit: '10' }
app.get('/api/v1/country/:country/:limit', (req, res) => {
    // console.log(req.query, req.params, req.body, req.method, req.headers)
  console.log(req.params)
  const { country, limit } = req.params
  try {
  cliente.connect()
  cliente.query(`SELECT * FROM country WHERE country LIKE '%${country}%' LIMIT ${limit};`)
    .then(result => {
      console.log("🚀 ~ file: server.js:48 ~ cliente.query ~ result:", result)      
      return res.status(200).json({ data: result.rows })
    })
    .catch(err => {
      console.log("🚀 ~ file: server.js:48 ~ cliente.query ~ err:", err)
      return res.status(500).json({ error: 'No hay resultados' })
    })
  } catch (error) {
    console.log({ error })
    return res.status(400).json({ error: 'si se puede'})
  }
  
})


app.listen(port, () => {
  console.log('Que ya esta andando en servidor')
})