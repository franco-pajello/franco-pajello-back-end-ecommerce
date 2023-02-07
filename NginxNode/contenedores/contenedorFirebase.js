const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const coneccionServi = require('../privi.json');

admin.initializeApp({ credential: admin.credential.cert(coneccionServi) });

const db = getFirestore();

class Contenedor {
    constructor(ruta) {
        this.ruta = ruta;
    }
    async getAll() {
        try {
            let res = await db.collection(this.ruta).get();

            const arrayDeElementos = res.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });

            return arrayDeElementos;
        } catch (err) {
            return { error: true, msg: err };
        }
    }
    async getById(id) {
        try {
            let arrayDeElementos = (
                await db.collection(this.ruta).doc(id).get()
            ).data();
            return arrayDeElementos;
        } catch (err) {
            return { error: true, msg: err };
        }
    }
    async save(produc) {
        try {
            res = await db.collection(this.ruta).doc().set(produc);

            return { success: true };
        } catch (err) {
            return { error: true, msg: err };
        }
    }
    async deleteAll() {
        try {
            let arrayDeProductos = [];

            const buscandoProductoDbCarrito = (await db.collection(this.ruta).get())
                .docs;

            buscandoProductoDbCarrito.forEach((doc) => {
                arrayDeProductos.push({ idCar: doc.id, ...doc.data() });
            });

            arrayDeProductos.forEach(async (e) => {
                db.collection(this.ruta).doc(e.idCar).delete();
            });
        } catch (err) {
            return { error: true, msg: 'no pudimos borra el producto' };
        }
    }
    async deleteById(id) {
        try {
            let arrayDeProductos = [];

            const buscandoProductoDbCarrito = (await db.collection(this.ruta).get())
                .docs;

            buscandoProductoDbCarrito.forEach((doc) => {
                arrayDeProductos.push({ idCar: doc.id, ...doc.data() });
            });

            arrayDeProductos.forEach(async (e) => {
                if (e.id == id || e.idCar == id) {
                    if (e.cantidad > 1) {
                        let cantidad = (await e.cantidad) - 1;
                        const carColeccion = db.collection(this.ruta).doc(e.idCar);
                        await carColeccion.update({ cantidad: cantidad });
                        return { success: true };
                    } else {
                        db.collection(this.ruta).doc(e.idCar).delete();
                        return { success: true };
                    }
                }
            });
        } catch (err) {
            return { error: true, msg: 'no pudimos borra el producto' };
        }
    }
    async upDateById(id, body) {
        const carColeccion = db.collection(this.ruta).doc(id);
        await carColeccion.update({
            producto: body.producto,
            precio: body.precio,
            img_url: body.img_url,
            stock: body.stock,
        });
        return { success: true };
    }
}

module.exports = { Contenedor };
