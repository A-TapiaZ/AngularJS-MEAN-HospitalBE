/*
  Ruta: '/api/v1/usuarios'
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getUsuarios, newUsuarios, updateUsuario, deleteUsuario } = require("../controllers/usuarios.controller");
const {validarCampos} = require("../middlewares/validar-campos");
const {validarJWT} = require("../middlewares/validarJWT");

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', 
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password','La constraseña es obligatoria').not().isEmpty(),
    check('email','El Email es obligatorio').isEmail(), 
    validarCampos
  ] , newUsuarios); 

router.put('/:id', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email','El Email es obligatorio').isEmail(), 
    validarCampos
  ] , updateUsuario); 

router.delete('/:id', validarJWT, deleteUsuario); 


module.exports= router; 