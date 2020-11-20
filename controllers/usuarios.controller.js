const { response } = require("express");
const Usuario = require("../models/usuario.model");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/JWT");


const getUsuarios= async (req,res=response) => {
  
  try {
    
    const desde = Number(req.query.desde) || 0;
    // PAGINACION
    // De esta forma realizo una paginacion, pero a la larga si tengo muchos registros, puede ser ineficiente ya que realiza dos consultas por aparte, cuando puedo realizarlas en un mismo instante.  
    // const usuarios = await Usuario
    //   .find({}, 'nombre email role google')
    //   .skip(desde)
    //   .limit(5)
    // ;
    // const totalUsuarios= await Usuario.countDocuments();

    // Promise.all ejecuta promosesas simultaneamente (al mismo tiempo pues) 
    const [usuarios,totalUsuarios] = await Promise.all([
      
      Usuario.find({}, 'nombre email role google img')
      .skip(desde)
      .limit(5),

      Usuario.countDocuments()
    ]);

    res.status(200).json({
      ok:true,
      usuarios,
      totalUsuarios
    })
  } catch (err) {
    
    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}

const newUsuarios= async (req, res=response) => {
  
  const {nombre, password, email} = req.body;

  try {

    // Busca entre los registros que el correo no exista
    const existeEmail= await Usuario.findOne({email});
    
    if (existeEmail) {
      return res.status(400).json({
        ok:false,
        msg:'El correo ya esta registrado'
      })
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    // El salt es como una funcion que genera un valor aletorio, una especie de firma.
    const salt = bcrypt.genSaltSync();
    usuario.password= bcrypt.hashSync(password, salt);

    const {_id:uid}= await usuario.save();

    // generar el token

    const token = await generarJWT(uid);

    res.json({
      ok:true,
      usuario,
      token,
    })

  } catch (err) {

    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}

const updateUsuario= async (req, res=response) => {
  
  const uid = req.params.id;

  try {

    // Busca entre los registros que el usuario exista
    const usuarioDB= await Usuario.findById(uid);
    
    if (!usuarioDB) {
      return res.status(404).json({
        ok:false,
        msg:'El usuario no existe'
      })
    }

    // Actualizaciones
    // password, google, email ya no hacen parte de la copia de campos.
    const {password, google, email, ...campos} = req.body;

    if (usuarioDB.email !== email) {
   
      // Busca entre los registros que el correo no exista
      const existeEmail= await Usuario.findOne({email});
      
      if (existeEmail) {
        return res.status(400).json({
          ok:false,
          msg:'El correo ya esta registrado'
        })
      }
    }

    if (!usuarioDB.google) {
      campos.email=email;
    }else if (usuarioDB.email!==email) {
      return res.status(400).json({
        ok:false,
        msg:'Los usuarios de google no pueden cambiar su correo'
      })
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true});

    res.json({
      ok:true,
      usuario:usuarioActualizado,
    })

  } catch (err) {

    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}

const deleteUsuario= async (req, res=response) => {
  
  const uid = req.params.id;

  try {

    // Busca entre los registros que el usuario exista
    const usuarioDB= await Usuario.findById(uid);
    
    if (!usuarioDB) {
      return res.status(404).json({
        ok:false,
        msg:'El usuario no existe'
      })
    }

    const usuarioBorrado = await Usuario.findByIdAndDelete(uid)

    res.json({
      ok:true,
      usuario:usuarioBorrado,
    })

  } catch (err) {

    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}






module.exports={
  getUsuarios,
  newUsuarios,
  updateUsuario,
  deleteUsuario,
}