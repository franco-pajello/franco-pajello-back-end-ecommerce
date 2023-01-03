const carritoRequire = require("../../contenedores/contenedorMongo.js")
class CarritoDaosMongo extends carritoRequire.Contenedor {
    constructor() {
        super("carrito")
    }
    async post(produc) {
        try {

            const nuevoElemento = new this.schema({
                producto: produc._doc.producto,
                precio: produc._doc.precio,
                img_url: produc._doc.img_url,
                stock: produc._doc.stock,
                cantidad: 1
            })
            await nuevoElemento.save()
            return { success: true };

        } catch (err) {
            return { success: false, error: err };
        }

    }
}

module.exports = { CarritoDaosMongo };





