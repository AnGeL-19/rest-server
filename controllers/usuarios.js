const { response, request } = require('express');

const usuariosGet = ( req = request , res = response) => {
  
   const { q, nombre = '', apikey, page = 1, limit} = req.query;

   
    res.json({
        msg: ' get Api - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = ( req , res = response) => {
    
    const {nombre, edad} = req.body;
    
    res.json({
        msg: ' post Api - controlador',
        nombre,
        edad
    });
}

const usuariosPut = ( req , res = response) => {
    
    // el id tambien se puede desestructurar
    // const { id } = req.params tambien sirve
    const id = req.params.id;
    
    res.json({
        msg: ' put Api - controlador',
        id
    });
}

const usuariosPatch = ( req , res = response) => {
    res.json({
        msg: ' patch Api - controlador'
    });
}

const usuariosDelete = ( req , res = response) => {
    res.json({
        msg: ' DELETE Api - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}