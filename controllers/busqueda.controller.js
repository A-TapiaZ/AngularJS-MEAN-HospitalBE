const { response } = require("express");
const Usuario = require("../models/usuario.model");
const Hospital = require("../models/hospital.model");
const Medico = require("../models/medico.model");


const getBusqueda = async (req,res=response) => {

  try {

    const busqueda= req.params.busqueda
    const busquedaRegex = new RegExp(busqueda, 'i');

    // const usuarios = await Usuario.find({nombre : busquedaRegex});
    // const hospitales = await Hospital.find({nombre : busquedaRegex});
    // const medicos = await Medico.find({nombre : busquedaRegex});


    const [usuarios, hospitales, medicos ] = await Promise.all([

      Usuario.find({nombre : busquedaRegex}),
      Hospital.find({nombre : busquedaRegex}),
      Medico.find({nombre : busquedaRegex}),
    ])




    res.json({
      ok:true,
      msg: 'Estamos en busqueda !!!!',
      busqueda,
      usuarios,
      hospitales,
      medicos
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
} 


const getDocumentosColeccion = async (req,res=response) => {

  try {

    const tabla= req.params.tabla
    const busqueda= req.params.busqueda
    const busquedaRegex = new RegExp(busqueda, 'i');

    let data = [];
    
    switch (tabla) {
      case 'usuarios':
        data = await Usuario.find({nombre : busquedaRegex});
        break;  
      case 'medicos':
        data = await Medico.find({nombre : busquedaRegex}).populate('usuario', 'nombre img').populate('hospital', 'nombre img');
        break;
      case 'hospitales':
        data = await Hospital.find({nombre : busquedaRegex}).populate('usuario', 'nombre img');
        break;
    
      default:
        return res.status(400).json({
          ok:false, 
          msg: 'La tabla debe de ser usuarios, medicos, o hospitales'
        });
    }

    res.json({
      ok:true,
      resultado:data
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
} 


module.exports = {
  getBusqueda,
  getDocumentosColeccion
}