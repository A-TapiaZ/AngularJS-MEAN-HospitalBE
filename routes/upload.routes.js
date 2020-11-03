/*
  Ruta: '/api/v1/upload'
*/

const { Router } = require("express");
const expressFileUpload = require('express-fileupload');


const { check } = require("express-validator");
const { fileUpload, getImg } = require("../controllers/upload.controller");
const {validarJWT} = require("../middlewares/validarJWT");

const router = Router();

// ESTE middleware.
router.use(expressFileUpload());

router.get('/:tipo/:img', [validarJWT,], getImg);
router.put('/:tipo/:id', [validarJWT,], fileUpload);


module.exports= router; 
