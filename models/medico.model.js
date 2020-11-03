const {Schema, model} = require('mongoose');

const MedicoSchema = Schema({

  nombre:{
    type: String,
    required:true
  },
  img:{
    type: String,
  },
  usuario: {
    type:Schema.Types.ObjectId,
    ref:'Usuario',
    required:true
  },
  hospital: {
    type:Schema.Types.ObjectId,
    ref:'Hospital',
    required:true
  }
},); 

// Cambiar le _id que nos retorna mongoDB y cambiarlo por uid, extraemos los valore que no quremos que nos retorne en este caso solo la version(__v)
MedicoSchema.method('toJSON', function () {
  const {__v,...object} = this.toObject();
  return object;
})


module.exports = model('Medico', MedicoSchema);