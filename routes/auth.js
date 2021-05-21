const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('correo', 'No es un correo valido').isEmail(),
    check('correo', 'Es necesario el correo').not().isEmpty(),
    check('password', 'Es necesaria una contraseña').not().isEmpty(),
    validarCampos
], login );


module.exports = router;