const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, 
        obtenerCategorias,
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categorias');

const { existeCategoriaId,
        existeNombreCategoria } = require('../helpers/db-validators');

const { validarJWT,
        validarCampos,
        esAdminRole } = require('../middlewares');


const router = Router();

// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// crear un middleware donde validemos si existe una categoria
router.get('/:id', [
    check('id','Es necesario un ID').not().isEmpty(),
    check('id',"El no es un id de mongo").isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
] , obtenerCategoria );

// crear categoria - privado - cualquier con un token valido 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es necesario').not().isEmpty(),
    check('nombre').custom(existeNombreCategoria),
    validarCampos
] , crearCategoria);

// actualizar
router.put('/:id', [
    validarJWT,
    check('nombre','Es necesario el nombre').not().isEmpty(),
    check('id','Es necesario un ID').not().isEmpty(),
    check('id',"El no es un id de mongo").isMongoId(),
    check('id').custom(existeCategoriaId),
    check('nombre').custom(existeNombreCategoria),
    validarCampos
] ,actualizarCategoria);


// borrar que solo sea el admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','Es necesario un ID').not().isEmpty(),
    check('id',"El no es un id de mongo").isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos
] ,borrarCategoria);






module.exports = router;