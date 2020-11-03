const Usuario = require("../models/usuario.model");
const Medico = require("../models/medico.model");
const Hospital = require("../models/hospital.model");

const fs = require('fs');

const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}


const actualizarImagen = async (tipo, id, nombreArchivo) => {
  
  let pathViejo = '';

  switch (tipo) {
    case 'medicos':
      const medicoDB = await Medico.findById(id);

      if (!medicoDB) {
        console.log('no se encontro un medico por ese id');
        return false;
      }
    
      pathViejo= `./upload/medicos/${medicoDB.img}`;
      borrarImagen(pathViejo);

      medicoDB.img = nombreArchivo;
      await medicoDB.save();
    return true;
         
    case 'usuarios':
      const usuarioDB = await Usuario.findById(id);

      if (!usuarioDB) {
        console.log('no se encontro un usuario por ese id');
        return false;
      }
    
      pathViejo= `./upload/usuarios/${usuarioDB.img}`;
      borrarImagen(pathViejo);

      usuarioDB.img = nombreArchivo;
      await usuarioDB.save();
    return true;
    
    case 'hospitales':
      
      const hospitalDB = await Hospital.findById(id);

      if (!hospitalDB) {
        console.log('no se encontro un hospital por ese id');
        return false;
      }
    
      pathViejo= `./upload/hospitales/${hospitalDB.img}`;
      borrarImagen(pathViejo);

      hospitalDB.img = nombreArchivo;
      await hospitalDB.save();
    return true;

  }

}


module.exports= {
  actualizarImagen
}