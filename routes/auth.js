const { Router } = require('express');
const { check } = require('express-validator');

const { login,
        googlesignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'No es un correo valido').isEmail(),
    check('correo', 'Es necesario el correo').not().isEmpty(),
    check('password', 'Es necesaria una contraseña').not().isEmpty(),
    validarCampos
], login );


//router.post('/google',[
//    check('id_token', 'El id_token es necesario'),
//    validarCampos
//], googlesignIn);

module.exports = router;