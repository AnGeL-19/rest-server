const { response , request} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');
    console.log(token);

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try{

        const { uid } = jwt.verify(token, process.env.SECRETPRIVATEKEY);

        const usuario =  await Usuario.findById(uid);

        if( !usuario ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en DB'
            });
        }

        // verificar si el uid tiene estado true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();

    }catch(err){
        console.log(err);
        res.status(401).json({
            msg: 'TOKEN no valido'
        });
    }
   
}

module.exports = {
    validarJWT
}