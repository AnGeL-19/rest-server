const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivos, 
        actualizarImagen, 
        mostrarImagen, 
        actualizarImagenCloudinary } = require('../controllers/uploads');
const { colecionesPermitidas } = require('../helpers');

const { validarCampos,
        validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', validarArchivo ,cargarArchivos);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => colecionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], actualizarImagenCloudinary);
//], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => colecionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;