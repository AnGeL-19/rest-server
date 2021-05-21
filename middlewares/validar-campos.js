const { validationResult } = require('express-validator');

// middleware personalizados

const validarCampos = ( req, res, next) => {

    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json(errores);
    }

    next(); // los middleware si todo sale bien que pase al siguiente

}

module.exports = {
    validarCampos
}