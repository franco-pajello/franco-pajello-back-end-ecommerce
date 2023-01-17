const productoRequire = require('../../contenedores/contenedorMongo.js');
let modelo = require('../../models/productos.js').modeloDelProducto;
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
class ProductoDaosMongo extends productoRequire.Contenedor {
    constructor() {
        super('productos', modelo, nuevoElemento);
    }
}
module.exports = { ProductoDaosMongo };
