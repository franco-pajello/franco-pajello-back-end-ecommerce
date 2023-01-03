const carritoRequire = require("../../contenedores/contenedorMemoria.js")

class CarritoDaosMemoria extends carritoRequire.Contenedor {
    constructor() {
        super("carrito")
    }
}
const carritoConstructor = new CarritoDaosMemoria()

carritoConstructor.save("hsjwstl")
