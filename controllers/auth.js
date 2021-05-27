const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jws');
const { googlevVerify } = require('../helpers/google-verify');

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

const googlesignIn = async (req, res=response) => {

    const {id_token} = req.body;
    console.log(id_token);

    try{
    const googleUser =  await googlevVerify(id_token);
    console.log(googleUser);
        res.json({
            msg: 'todo bien al cienon signin'
        });
    }catch(err){
        console.log(err);
        res.status(400).json({
            msg: 'Token de google no es valido'
        });
    }

}

module.exports = {
    login,
    googlesignIn
}