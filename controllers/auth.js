const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jws');

const login = async ( req, res = response ) => {

    const { correo, password } = req.body;

    try{

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos -correo'
            })
        } 

    
        // Si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario desactivado - estado: false'
            })
        }

        // Vereficar la constraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / password no son correcto - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            msg: 'hable con el administrador'
        });
    }

    

}

module.exports = {
    login
}