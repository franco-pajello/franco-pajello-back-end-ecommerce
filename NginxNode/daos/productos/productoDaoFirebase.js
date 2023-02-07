const PoductosRequire = require('../../contenedores/contenedorFirebase.js');

class PoductosDaosFirebase extends PoductosRequire.Contenedor {
    constructor() {
        super('poductos');
    }
}

module.exports = { PoductosDaosFirebase };
