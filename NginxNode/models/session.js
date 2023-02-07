const { Schema } = require('mongoose');
const modeloSession = new Schema({
    nombre: { type: String, require: true },
});

module.exports = { modeloSession };
