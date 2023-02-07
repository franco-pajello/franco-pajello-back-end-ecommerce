const mongoose = require('mongoose');
const modeloUsuario = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
});
const Usuarios = mongoose.model('usuarios', modeloUsuario);
module.exports = Usuarios;
