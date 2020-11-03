const {Schema, model} = require('mongoose');

const HospitalSchema = Schema({

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
  }
}, {collection: 'hospitales'}); 

// Cambiar le _id que nos retorna mongoDB y cambiarlo por uid, extraemos los valore que no quremos que nos retorne en este caso solo la version(__v)
HospitalSchema.method('toJSON', function () {
  const {__v,...object} = this.toObject();
  return object;
})


module.exports = model('Hospital', HospitalSchema);