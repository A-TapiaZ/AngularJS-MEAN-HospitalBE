require('dotenv').config();
const express = require('express');
const { dbConnection } = require("./database/config");
const cors = require('cors');


// Crear el servidor de express
const app= express();
app.use(cors())

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio publico
app.use(express.static('public'));

// Routes
app.use('/api/v1/usuarios', require('./routes/usuario.routes'));
app.use('/api/v1/login', require('./routes/auth.routes'));
app.use('/api/v1/hospital', require('./routes/hospital.routes'));
app.use('/api/v1/medico', require('./routes/medicos.routes'));
app.use('/api/v1/busqueda', require('./routes/busqueda.routes'));
app.use('/api/v1/upload', require('./routes/upload.routes'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor en linea puerto: ${process.env.PORT}`);
})