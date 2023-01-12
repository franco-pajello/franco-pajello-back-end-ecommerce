const carritoRequire = require('../../contenedores/contenedorFirebase.js');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
class CarritoDaosFirebase extends carritoRequire.Contenedor {
    constructor() {
        super('carrito');
    }
    async post(produc) {
        try {
            let arrayCarrito = [];

            const arrayDeElementos = await db.collection(this.ruta).get();

            arrayDeElementos.forEach((doc) => {
                arrayCarrito.push({ idCar: doc.id, ...doc.data() });
            });

            arrayCarrito.forEach(async (e) => {
                if (e.id == produc.id) {
                    let cantidad = (await e.cantidad) + 1;
                    const carColeccion = db.collection(this.ruta).doc(e.idCar);
                    await carColeccion.update({
                        cantidad: cantidad,
                    });
                    return { success: true };
                }
                if (e.id !== produc.id) {
                    await db.collection(this.ruta).doc().set(produc);

                    return { success: true };
                }
            });
        } catch (err) {
            return { error: true, msg: err };
        }
    }
}
module.exports = { CarritoDaosFirebase };
