const { response, request } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async (req = request, res =  response) => {

    const {limite = 5, desde = 0} = req.query;
    const query =  {estado:true};
    
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
               .skip(desde)
               .limit(limite)
               .populate("usuario", 'nombre')
               .populate("categoria", 'nombre')
    ]);

    res.json({
        total,
        productos
    });
    

}

const obtenerProducto = async (req = request, res =  response) => {
    
    const {id} = req.params;
    const producto = await Producto.findById(id)
                                    .populate("usuario", 'nombre')
                                    .populate("categoria", 'nombre')

    res.json({
        producto
    });

}



const crearProducto = async (req = request, res =  response) => {

    const {estado, usuario, ...body} = req.body;

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    }

    try{
        
        const producto = new Producto(data);

        await producto.save();

       res.status(201).json(producto);

    }catch(err){
        res.status(400).json(err);
    }

}

const actualizarProducto = async (req = request, res =  response) => {

    const {id} = req.params;
    const {estado, usuario,  ...datos} = req.body;

    if (datos.nombre) {
        datos.nombre = datos.nombre.toUpperCase();
    }
    
    datos.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, datos, {new: true});

    res.json({
        producto
    });

}

const borrarProducto = async (req = request, res =  response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id,{estado:false},{new:true});
    const usuarioAutenticado = req.usuario;

    res.json({
        producto,
        usuarioAutenticado
    });
    

}





module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto,
    obtenerProductos
}