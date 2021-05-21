const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuariosGet = async ( req = request , res = response) => {
  
    const { limite =  5, desde = 0 } = req.query;
    const query = { estado: true };

    // en la destructuracion
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
                .skip(Number(desde))
                .limit(Number(limite))
    ]);
   
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async ( req , res = response) => {
    
    const {nombre, correo, password, rol} = req.body;
    const usuario =  new Usuario({nombre,correo, password, rol});

    // encriptar de la constraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    // guardar base de datos
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async ( req , res = response) => {
    
    // el id tambien se puede desestructurar 
   // const id = req.params.id; tambien sirve
    const { id } = req.params;
    const { password, google, correo,...resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto);

    res.json(usuario);
}

const usuariosPatch = ( req , res = response) => {
    res.json({
        msg: ' patch Api - controlador'
    });
}

const usuariosDelete = async ( req , res = response) => {
   
   const { id } = req.params;

    //const usuario = await Usuario.findByIdAndDelete(id); eliminado permanente
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}); // simulacion de eliminacion
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado 
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}