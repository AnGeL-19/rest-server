const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../db/config');


class Server {

    constructor(){
        
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuario:    '/api/usuarios',
            uploads:    '/api/uploads'
        }
    

        //Conectar a base de datos.
        this.conectarDB();

        // Middlewares
        this.middlewares();


        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }


    middlewares(){

        // CORS
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use( express.json() );

        // Directorio publico
        this.app.use(express.static('public'));

        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes(){
        this.app.use( this.paths.auth ,require('../routes/auth'));
        this.app.use( this.paths.buscar ,require('../routes/buscar'));
        this.app.use( this.paths.categorias ,require('../routes/categorias'));
        this.app.use( this.paths.productos ,require('../routes/productos'));
        this.app.use( this.paths.usuario ,require('../routes/usuarios'));
        this.app.use( this.paths.uploads ,require('../routes/uploads'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en http://localhost:${this.port}`);
        });
    }

}

module.exports = Server;