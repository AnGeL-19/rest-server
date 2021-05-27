const Role = require('../models/role');
const { Usuario,
        Categoria,
        Producto } = require('../models');


const esRoleValido = async (rol = '') => {
    const exiteRol = await Role.findOne({rol});
    if( !exiteRol){
        throw new Error(`El rol ${ rol} no esta registrado en al BD`);
    }
}

 // verificar si el correo existe
const existeEmail = async (correo = '') => {
    const existe = await Usuario.findOne({correo});
    if (existe) {
        throw new Error('El correo ya esta registrado');
    }
}

const existeUsuarioPorId = async ( id ) => {
    const existe = await Usuario.findById(id);
    if (!existe) {
        throw new Error(`El id no existe ${existe}`);
    }
}

const existeCategoriaId = async ( id ) => {
    const existe = await Categoria.findById(id);
    if (!existe) {
        throw new Error(`El id no existe ${existe}`);
    }

}

const existeProductoId = async ( id ) => {
    const existe = await Producto.findById(id);
    if (!existe) {
        throw new Error(`El id no existe ${existe}`);
    }

}

const existeNombreCategoria = async (nombre) => {

    nombre = nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if(categoriaDB){
        throw new Error(`La categoria ${ categoriaDB.nombre }, ya existe`);
    }
}

const existeNombreProducto = async (nombre) => {

    nombre = nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre });
    if(productoDB){
        throw new Error(`El producto ${ productoDB.nombre }, ya existe`);
    }
}

const colecionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if(!incluida){
        throw new Error(`La coleccion ${ coleccion } no es permitida, ${colecciones}`)
    }
    return true;

}
      
 

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaId,
    existeNombreCategoria,
    existeNombreProducto,
    existeProductoId,
    colecionesPermitidas
}