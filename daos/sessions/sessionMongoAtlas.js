const requireSession = require('../../contenedores/contenedorMongo.js');
let modelo = require('../../models/session.js').modeloSession;

async function nuevoElemento(nombre) {
    const nuevoElemento = new this.schema({
        nombre: nombre.nombre,
    });
    await nuevoElemento.save();
}
class session extends requireSession.Contenedor {
    constructor() {
        super('sessions', modelo, nuevoElemento);
    }
}
module.exports = { session };
