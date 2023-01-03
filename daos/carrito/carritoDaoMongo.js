const carritoRequire = require("../../contenedores/contenedorMongo.js")
class CarritoDaosMongo extends carritoRequire.Contenedor {
    constructor() {
        super("carrito")
    }
}

module.exports = { CarritoDaosMongo };





