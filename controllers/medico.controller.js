const { response } = require("express");
const Medico = require("../models/medico.model");
const Hospital = require("../models/hospital.model");


/* IMPLEMENTACIONES */

const getMedicos = async (req,res=response) => {
  
  try {
    const medicos = await Medico.find()
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img');

    res.status(200).json({
      ok:true,
      medicos,
      msg:'Estamos en Medicos',
    })
  } catch (error) {
    
    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }

}


const newMedico= async (req, res=response) => {
  
  const {nombre, hospital} = req.body;

  try {

    // Busca entre los registros que el correo no exista
    const existeMedico= await Medico.findOne({nombre});
    
    if (existeMedico) {
      return res.status(400).json({
        ok:false,
        msg:'El Medico ya esta registrado'
      })
    }

    const uid = req.uid;
    const medico = new Medico({
      usuario:uid,
      ...req.body,
    });

    const medicoDB= await medico.save();


    res.json({
      ok:true,
      medicoDB,
    })

  } catch (err) {

    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}

const updateMedico= async (req, res=response) => {
  
  const {hospital:hospitalID}=req.body;
  const {id}= req.params;
  const uid =req.uid;

  try {

    // Busca entre los registros que el id no exista
    const existeMedicoID= await Medico.findById(id);

    if (!existeMedicoID) {
      return res.status(404).json({
        ok:false,
        msg:'Medico no encontrado'
      })
    }

    // Busca entre los registros que el id exista
    if (hospitalID) { 
      const existeHospitalID= await Hospital.findById(id);

      if (!existeHospitalID) {
        return res.status(404).json({
          ok:false,
          msg:'Hospital no encontrado'
        })
      }
    }

    const cambiosMedico = {
      ...req.body,
      usuario:uid,
    }

    const medicoDB= await Medico.findByIdAndUpdate(id,cambiosMedico,{new:true});

    res.json({
      ok:true,
      msg:'Medico actualizado',
      Medico:medicoDB,
    })

  } catch (err) {

    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}

const deleteMedico= async (req, res=response) => {
  

  const id= req.params.id;
  try {

    // Busca entre los registros que el id exista
    const existeMedicoID= await Medico.findById(id);

    if (!existeMedicoID) {
      return res.status(404).json({
        ok:false,
        msg:'Medico no encontrado'
      })
    }

    // NO SE ACONSEJA ELIMINAR REGISTROS DE LA BASE DE DATOS, LO MEJOR ES CREAR UNA PROPIEDAD COMO 'ESTADO'  PARA SABER SI SE ENCUENTRA ACTIVO O NO, Y SOLO CAMBIARLO SIN ELIMINARLO DE LOS REGISTROS.
    const eliminatedMedico = await Medico.findByIdAndDelete(id);


    res.json({
      ok:true,
      msg:'Medico eliminado',
      hospital:eliminatedMedico,
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
  getMedicos,
  newMedico,
  updateMedico,
  deleteMedico,
}




