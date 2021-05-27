const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } =  require('../helpers');

const { Producto, Usuario } = require('../models');


const cargarArchivos = async (req, res = response) => {

    try{
        // imagenes
        const nombre = await subirArchivo(req.files, ['txt','md'], 'textos');

        res.json({
            nombre
        });
    }catch(msg){
        res.status(400).json({msg});
    }
    

}

const actualizarImagen = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo =  await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo =  await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        // hay que borrar la imagen del servidor
        const pathImagen =  path.join(__dirname, '../uploads', coleccion, modelo.img);
        if( fs.existsSync(pathImagen) ){
            fs.unlinkSync(pathImagen);
        }
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    })

}

const actualizarImagenCloudinary = async (req, res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo =  await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo =  await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

   
    try{

        // Limpiar imagenes previas
        if(modelo.img){
            // hay que borrar la imagen del servidor cloudinary
            const nombreArr =  modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [ public_id ] = nombre.split('.');

            cloudinary.uploader.destroy(public_id);
            
        }

        const { tempFilePath } = req.files.archivo;

        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

        modelo.img = secure_url;

        await modelo.save();


        res.json({
            modelo
        });
    
    }catch(err){
        res.status(400).json({
            err
        });
    }
    
}

const mostrarImagen = async (req, res =  response) => {

    const {id, coleccion} = req.params;

    const pathNoImagen =  path.join(__dirname, '../assets/no-image.jpg' );

    let modelo;

    switch( coleccion ){
        case 'usuarios':
            modelo =  await Usuario.findById(id);
            if(!modelo){
                return res.status(400).sendFile(pathNoImagen);
            }
            break;
        case 'productos':
            modelo =  await Producto.findById(id);
            if(!modelo){
                return res.status(400).sendFile(pathNoImagen);
            }
            break;
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if(modelo.img){
        // hay que borrar la imagen del servidor
        const pathImagen =  path.join(__dirname, '../uploads', coleccion, modelo.img);
        if( fs.existsSync(pathImagen) ){
            return res.sendFile(pathImagen);
        }
    }

    res.sendFile(pathNoImagen);

}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}