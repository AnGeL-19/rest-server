const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRol
 } = require('../middlewares/');

const { esRoleValido,
        existeEmail,
        existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete 
      } = require('../controllers/usuarios');




const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut );

// (ruta, middleware, controlardor) o
// (ruta, controlardor)
router.post('/', [

    // esto va preparando los error si no se cumple y 
    // los pone en la request (req)
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mayor a 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROL','USER_ROL']),
    check('rol').custom( esRoleValido ), // se puede enviar .custom( esRoleValido ) asi como esta o tambien
    // .custom( (rol) => esRoleValido(rol) ), los callbacks cuando son de un solo argumento se suele poner 
    // .custom( esRoleValido ) es mas facil de leer
    check('correo').custom( existeEmail ),
    validarCampos // middleware personalizado
] ,usuariosPost );

router.patch('/', usuariosPatch );

router.delete('/:id', [
    validarJWT,
    //esAdminRole, // ESTE TIENE QUE SER DE AFUERZAS EL ROL DE ADMIN PARA BORRAR
    tieneRol("ADMIN_ROL", "USER_ROL"), // SON LOS ROLES QUE TIENE ACCESO A BORRAR
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] , usuariosDelete);


module.exports = router;