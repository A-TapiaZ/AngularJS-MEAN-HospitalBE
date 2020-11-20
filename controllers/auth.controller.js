const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require("../models/usuario.model");
const { generarJWT } = require("../helpers/JWT");
const {verify} = require("../helpers/google-verify");


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

    if (!validPassword) {
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
      msg:'Estamos en login',
      usuario:usuarioDB,
      id:usuarioDB._id,
    })

  } catch (error) {

    console.log(error);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}


const loginGoogle= async (req, res=response) => {
  
  
  try {
    const googleToken= req.body.token;

    const {name,email,picture} =  await verify(googleToken);
 
    const usuarioDB = await Usuario.findOne({email}) ;

    console.log(usuarioDB);
    let usuario = '';

    if (!usuarioDB) {

      usuario = new Usuario({ 
        nombre:name,
        email,
        password:'@@@@',
        img: picture,
        google:true,
      });

    }else{
      // Existe usuario
      usuario = usuarioDB;
      usuario.google=true;
    }

    // Guardar en DB
    await usuario.save();
    
    // generar el token
    const token = await generarJWT(usuario.id);

    res.status(200).json({
      ok:true,
      token
    })

  } catch (error) {

    console.log(error);
    res.status(401).json({
      ok:false,
      msg: 'Token no es correcto...'
    });
  }
}


const renewToken = async (req, res=response) => {

  try {
  
    const uid = req.uid;
    
    // Renovar el token
    const token = await generarJWT(uid);

    const usuarioDB = await Usuario.findById(uid);

    res.status(200).json({
      ok:true,
      token,
      uid,
      usuario:usuarioDB,
      msg:'Token renovado' 
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
  login,
  loginGoogle,
  renewToken
}