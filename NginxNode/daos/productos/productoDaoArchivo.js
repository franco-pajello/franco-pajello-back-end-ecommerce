const contenedorRequire = require('../../contenedores/contenedorArchivos.js');
const data = './data/data.json';

class productoDaoArchivo extends contenedorRequire.Contenedor {
    constructor() {
        super(data);
    }
}
const objeto = new productoDaoArchivo();

module.exports = { productoDaoArchivo };
