const chatRequire = require('../../contenedores/contenedorMongo.js');
const modelo = require('../../models/chat.js').modeloDelchat;
async function nuevoElemento(elemento) {
    const nuevoElemento = new this.schema({
        id: elemento.id,
        autor: {
            id: elemento.autor.email,
            email: elemento.autor.email,
            nombre: elemento.autor.nombre,
            edad: elemento.autor.edad,
        },
        fecha: elemento.fecha,
        msgs: elemento.msgs,
    });
    await nuevoElemento.save();
}
class chatDaosMongo extends chatRequire.Contenedor {
    constructor() {
        super('chat', modelo, nuevoElemento);
    }
}

module.exports = { chatDaosMongo };
