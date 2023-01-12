const { Schema } = require('mongoose');
const modeloDelchat = new Schema({
    id: { type: String, require: false },
    autor: {
        id: { type: String, require: true },
        email: { type: String, require: true },
        nombre: { type: String, require: true },
        edad: { type: Number, require: true },
    },
    msgs: { type: String, require: true },
});

module.exports = { modeloDelchat };
