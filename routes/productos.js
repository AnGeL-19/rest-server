const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const { existeNombreProducto,
        existeProductoId,
        existeCategoriaId } = require('../helpers/db-validators');


const { obtenerProductos, 
        crearProducto, 
        obtenerProducto,
        actualizarProducto,
        borrarProducto} = require('../controllers/productos');

const router = Router();


router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'El id no es valido de mongo').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
] ,obtenerProducto);
    
router.post('/', [
    validarJWT,
    check('nombre','Es necesario el nombre del producto').not().isEmpty(),
    check('nombre').custom(existeNombreProducto),
    check('categoria', 'El id de categoria no es de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos
] ,crearProducto );

router.put('/:id', [
    validarJWT,
    check('id',"El no es un id de mongo").isMongoId(),    check('categoria', 'El id de categoria no es de mongo').isMongoId(),
    ///check('categoria', 'El id de categoria no es de mongo').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
],actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','Es necesario un ID').not().isEmpty(),
    check('id',"El no es un id de mongo").isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
] ,borrarProducto);


module.exports = router;