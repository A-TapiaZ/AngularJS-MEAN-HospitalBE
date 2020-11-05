/*
  '/api/v1/hospital'
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getHospitales, newHospital, updateHospital, deleteHospital } = require("../controllers/hospital.controller");
const {validarCampos} = require("../middlewares/validar-campos");
const {validarJWT} = require("../middlewares/validarJWT");

const router = Router();

router.get('/', validarJWT, getHospitales );

router.post('/', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
  ] , newHospital); 

router.put('/:id', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
  ] , updateHospital); 

router.delete('/:id', validarJWT, deleteHospital); 


module.exports= router; 