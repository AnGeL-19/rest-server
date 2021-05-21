const mongoose = require('mongoose');

const dbConnection = async() => {

    try{

        mongoose.connect( process.env.MONGODB_CNN, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useCreateIndex: true,
           useFindAndModify: false
        });

        console.log('base de datos conectada');

    }catch(err){
        console.log(err);
        throw new Error('Error a la hora de iniciar la base de datops');
    }

}

module.exports = {
    dbConnection
}