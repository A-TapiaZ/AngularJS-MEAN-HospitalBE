const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario.model");
const { generarJWT } = require("../helpers/JWT");


const login = async (req, res=response) => {
  
  const {email, password}= req.body;

  try {
  
    // CONSEJO: por si atacen la api de login, podemos ponerle un delay de un segundo a la validacion y esto para el usuario no seria mucho, pero para alguien que ataca seria una 'gran' demora 

    // Verificar EMAIl
    const usuarioDB = await Usuario.findOne({email});
    console.log(usuarioDB);
    if (!usuarioDB) {
      return res.status(404).json({
        ok:false,
        msg:'Un mensaje que no le de pistas por si me atacan, para este caso solo por estar en desarrollo no se encontro el correo'
      })
    }


    // Verificar CONTRASEÑA
    const validPassword= bcrypt.compareSync(password, usuarioDB.password);

    if (validPassword) {
      return res.status(400).json({
        ok:false,
        msg:'Un mensaje que no le de pistas por si me atacan, para este caso solo por estar en desarrollo la contraseña no es valida'
      })
    }

    // generar el token
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
      ok:true,
      token,
      msg:'Estamos en login' 
    })

  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}

module.exports={
  login
}