const mongoose = require('mongoose');

const dbConnection = async () => {
  

  try {
    await mongoose.connect(process.env.DB_CNN, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify: false,
    });

    console.log(`Conneccion a BD exitosa`);
  } catch (error) {
    console.warn(error);
  }
}
 
module.exports = {
  dbConnection
}