const chatRequire = require('../../contenedores/contenedorMongo.js');
const modelo = require('../../models/chat.js').modeloDelchat;

class chatDaosMongo extends chatRequire.Contenedor {
    constructor() {
        super('chat', modelo);
    }
    async post(msg) {
        console.log(msg);
        try {
            const nuevoElemento = new this.schema({
                autor: {
                    id: msg.email,
                    email: msg.email,
                    nombre: msg.nombre,
                    edad: msg.edad,
                },
                msgs: msg.msg,
            });

            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

module.exports = { chatDaosMongo };
