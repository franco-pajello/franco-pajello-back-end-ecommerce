const carritoRequire = require("../../contenedores/contenedorFirebase.js")
const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()
class CarritoDaosFirebase extends carritoRequire.Contenedor {
    constructor() {
        super("carrito")
    }
}
module.exports = { CarritoDaosFirebase };




