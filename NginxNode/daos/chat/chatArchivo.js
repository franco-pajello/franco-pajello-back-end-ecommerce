const fs = require('fs');
const chatRequire = require('../../contenedores/contenedorArchivos.js');
const data = './data/chat.json';
class chatDaosArchivo extends chatRequire.Contenedor {
    constructor() {
        super(data);
    }
    async post(msg) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
            const archivoFormatoJs = await JSON.parse(lecturaArchivo);
            await archivoFormatoJs.push(msg);
            const archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
            await fs.promises.writeFile(this.ruta, archivoFormatoTxt);
            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err };
        }
    }
}
const chat = new chatDaosArchivo();
module.exports = { chatDaosArchivo };
