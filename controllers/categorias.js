const { response, request } = require('express');
const { Categoria, Usuario } = require('../models');


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query =  {estado:true};
    
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
               .skip(desde)
               .limit(limite)
               .populate("usuario", 'nombre')
    ]);

    res.json({
        total,
        categorias
    });

}

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id)
                                     .populate("usuario","nombre");

    res.json({
        categoria
    });

}


const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    // generar la nada a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }

    try {
        const categoria = new Categoria(data);

        await categoria.save();

        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json(error);
    }

}

// actualizarCategoria
const actualizarCategoria = async (req, res) => {

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
 
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        categoria
    });

}

// borrarCategoria cambir de estado a false
const borrarCategoria = async (req, res) => {
    
    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});
    const usuarioAutenticado = req.usuario;

    res.json({
        categoria,
        usuarioAutenticado
    });

}

module.exports = {
    actualizarCategoria,
    borrarCategoria,
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria
}