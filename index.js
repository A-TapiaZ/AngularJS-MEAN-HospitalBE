require('dotenv').config();
const express = require('express');
const { dbConnection } = require("./database/config");
const cors = require('cors');


// Crear el servidor de express
const app= express();
app.use(cors())
// Base de datos
dbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Servidor en linea puerto: ${process.env.PORT}`);
})