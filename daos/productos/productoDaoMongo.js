const productoRequire = require("../../contenedores/contenedorMongo.js")
class ProductoDaosMongo extends productoRequire.Contenedor {
    constructor() {
        super("productos")
    }
}
module.exports = { ProductoDaosMongo };


