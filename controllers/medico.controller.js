const { response } = require("express");
const Medico = require("../models/medico.model");
const bcrypt = require('bcryptjs');
const { generarJWT } = require("../helpers/JWT");


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

/*
const updateMedico= async (req, res=response) => {
  
  const uid = req.params.id;

  try {

    // Busca entre los registros que el Medico exista
    const MedicoDB= await Medico.findById(uid);
    
    if (!MedicoDB) {
      return res.status(404).json({
        ok:false,
        msg:'El Medico no existe'
      })
    }

    // Actualizaciones
    // password, google, email ya no hacen parte de la copia de campos.
    const {password, google, email, ...campos} = req.body;

    if (MedicoDB.email !== email) {
   
      // Busca entre los registros que el correo no exista
      const existeEmail= await Medico.findOne({email});
      
      if (existeEmail) {
        return res.status(400).json({
          ok:false,
          msg:'El correo ya esta registrado'
        })
      }
    }

    campos.email=email;
    const MedicoActualizado = await Medico.findByIdAndUpdate(uid, campos, {new:true});

    res.json({
      ok:true,
      Medico:MedicoActualizado,
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
  
  const uid = req.params.id;

  try {

    // Busca entre los registros que el Medico exista
    const MedicoDB= await Medico.findById(uid);
    
    if (!MedicoDB) {
      return res.status(404).json({
        ok:false,
        msg:'El Medico no existe'
      })
    }

    const MedicoBorrado = await Medico.findByIdAndDelete(uid)

    res.json({
      ok:true,
      Medico:MedicoBorrado,
    })

  } catch (err) {

    console.log(err);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}
*/

module.exports={
  getMedicos,
  newMedico,
  // updateMedico,
  // deleteMedico,
}




