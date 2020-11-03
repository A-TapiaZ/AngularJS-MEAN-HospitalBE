const { response } = require("express");
const Hospital = require("../models/hospital.model");


const getHospitales = async (req,res=response) => {
  
  try {
    const hospitales = await Hospital.find().populate('usuario','nombre img');

    res.status(200).json({
      ok:true,
      hospitales,
      msg:'Estamos en hospitales',
    })
  } catch (error) {
    
    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }

}

const newHospital= async (req, res=response) => {
  
  const {nombre} = req.body;

  try {

    // Busca entre los registros que el correo no exista
    const existeHospital= await Hospital.findOne({nombre});
    
    if (existeHospital) {
      return res.status(400).json({
        ok:false,
        msg:'El Hospital ya esta registrado'
      })
    }

    const uid = req.uid;

    const hospital = new Hospital({
      usuario:uid,
      ...req.body,
    });


    const hospitalDB= await hospital.save();



    res.json({
      ok:true,
      hospitalDB,
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
  getHospitales,
  newHospital
}
