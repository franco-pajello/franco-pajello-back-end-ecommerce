const fs = require('fs');
const data = './data/chat.json';

class Chat {
    constructor(nombre) {
        this.nombre = nombre;
    }

    async save(dataChat) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            archivoFormatoJs.push(dataChat);

            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

            await fs.promises.writeFile(data, archivoFormatoTxt);

            return { success: true };
        } catch (err) {
            return { success: false, error: err }
        }
    }
    async getAll() {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err }
        }
    }
}

const chatConstructor = new Chat();

module.exports = { Chat };
