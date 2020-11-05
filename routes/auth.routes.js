/*
  Ruta: '/api/v1/login'
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { login, loginGoogle, renewToken} = require("../controllers/auth.controller");
const {validarCampos} = require("../middlewares/validar-campos");
const {validarJWT} = require("../middlewares/validarJWT");

const router = Router();


router.post('/', [
  check('email', 'el email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(), 
  validarCampos
], login )

router.post('/google', [
  check('token', 'El token de google es obligatoria').not().isEmpty(), 
  validarCampos
], loginGoogle )

router.get('/renew', [
  validarJWT
], renewToken )




module.exports= router; 
