const productoRequire = require('../../contenedores/contenedorMongo.js');
let modelo = require('../../models/productos.js').modeloDelProducto;
class ProductoDaosMongo extends productoRequire.Contenedor {
    constructor() {
        super('productos', modelo);
    }
}
module.exports = { ProductoDaosMongo };
