const carritoRequire = require('../../contenedores/contenedorMongo.js');
let modelo = require('../../models/carrito.js').modeloDelcarrito;
async function nuevoElemento(elemento) {
    const nuevoElemento = new this.schema({
        producto: elemento._doc.producto,
        precio: elemento._doc.precio,
        img_url: elemento._doc.img_url,
        stock: elemento._doc.stock,
        cantidad: 1,
    });
    await nuevoElemento.save();
}
class CarritoDaosMongo extends carritoRequire.Contenedor {
    constructor() {
        super('carrito', modelo, nuevoElemento);
    }
}
module.exports = { CarritoDaosMongo };
