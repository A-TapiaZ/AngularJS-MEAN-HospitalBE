const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
  nombre:{
    type: String,
    required:true
  },
  email:{
    type: String,
    required:true,
    unique:true
  },
  password:{
    type: String,
    required:true
  },
  img:{
    type: String,
  },
  role:{
    type: String,
    required:true,
    default: 'User_role'
  },
  google:{
    type: Boolean,
    default:false,
  },
}) 

// Cambiar le _id que nos retorna mongoDB y cambiarlo por uid
UsuarioSchema.method('toJSON', function () {
  const {__v, _id, password,...object} = this.toObject();

  object.uid=_id;
  return object;
})


module.exports = model('Usuario', UsuarioSchema);