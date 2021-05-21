const {Schema, model} = require('mongoose');

const RoleShema = Schema({

    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }

});

module.exports = model('Role', RoleShema);