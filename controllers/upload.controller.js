const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen} = require("../helpers/actualizar-imagen");

const path = require('path');
const fs = require('fs');


const fileUpload = async (req,res=response) => {
  
  try {

    const tipo= req.params.tipo;
    const id= req.params.id;

    const tiposValidos=['hospitales','medicos','usuarios'];

    if(!tiposValidos.includes(tipo)){
      return res.status(400).json({
        ok:false,
        msg:'No es medico usuarios o hospitales'
      })
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        ok:false,
        msg:'No hay ningun archivo'
      });
    }

    // Procesar la imagen
    // Este .files lo obtengo gracias al middelware que pusimos antes de la ruta
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo= nombreCortado[nombreCortado.length-1];

    // validar extension 
    const extensionesValidas = ['png','jpg','jpeg','gif'];
    if(!extensionesValidas.includes(extensionArchivo)){
      return res.status(400).json({
        ok:false,
        msg:'No es un formato aceptado'
      })
    }

    // Generar el nombre del archivo
    const nombreArvhivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen 
    const path = `./upload/${tipo}/${nombreArvhivo}`;

    // mover la imagen
    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
      
      if (err){
        
        console.log(err);
        return res.status(500).json({
          ok:false,
          msg:'error al mover la imagen'
        });
      }
        

      // Actualizar la imagen
      actualizarImagen(tipo,id,nombreArvhivo);


      res.json({
        ok:true,
        nombreArvhivo,
        msg: 'Imagen actualizada correctamente',
      });
    });


    

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
} 


const getImg = (req, res=response) => {
  
  try {
  
   const tipo = req.params.tipo;
   const img = req.params.img

   const pathImg = path.join(__dirname,`../upload/${tipo}/${img}`);
   
    if (fs.existsSync(pathImg)) {
      res.sendFile(pathImg)
    }else{
     const pathImg = path.join(__dirname,`../upload/no-img.jpg`);
     res.sendFile(pathImg)
    }

  } catch (error) {

    console.log(error);
    res.status(500).json({ 
      ok:false,
      msg: 'Error inesperado ...'
    });
  }
}




module.exports={
  fileUpload,
  getImg
}