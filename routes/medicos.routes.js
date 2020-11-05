/*
  '/api/v1/medico'
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getMedicos, newMedico, updateMedico, deleteMedico } = require("../controllers/medico.controller");
const {validarCampos} = require("../middlewares/validar-campos");
const {validarJWT} = require("../middlewares/validarJWT");

const router = Router();

router.get('/', validarJWT,  getMedicos);

router.post('/', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital debe ser valido').isMongoId(),
    validarCampos
  ] , newMedico ); 

router.put('/:id', 
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
  ] , updateMedico); 

router.delete('/:id', validarJWT, deleteMedico); 


module.exports= router; 