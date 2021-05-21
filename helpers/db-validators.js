const Role = require('../models/role');
const Usuario = require('../models/usuario');


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
      
 

module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}