const fs = require('fs');
const data = './data/carrito.json';

class carrito {
    constructor(nombre) {
        this.nombre = nombre;
    }

    async save(obj) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = await JSON.parse(lecturaArchivo);

            const buscandoProductoCarrito = await archivoFormatoJs.findIndex(
                (producto) => producto.id == obj.id
            );

            if (buscandoProductoCarrito < 0) {
                obj.cantidad = 1;
                await archivoFormatoJs.push(obj);
                const archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                await fs.promises.writeFile(data, archivoFormatoTxt);
                return archivoFormatoJs;
            } else {
                archivoFormatoJs[buscandoProductoCarrito].cantidad++;
                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                await fs.promises.writeFile(data, archivoFormatoTxt);
                return archivoFormatoJs;
            }
        } catch (err) {
            return { success: false, error: err };
        }
    }
    async getAll() {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err };
        }
    }
    async deleteById(id) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            const buscamosElementoId = archivoFormatoJs.find((e) => e.id == id);

            if (buscamosElementoId.cantidad > 1) {
                const buscandoProductoCarrito = await archivoFormatoJs.findIndex(
                    (producto) => producto.id == id
                );
                archivoFormatoJs[buscandoProductoCarrito].cantidad--;

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                await fs.promises.writeFile(data, archivoFormatoTxt);
                return { success: ok };
            } else {
                if (archivoFormatoJs.length > 1) {
                    const buscandoProductoCarrito = await archivoFormatoJs.findIndex(
                        (producto) => producto.id == id
                    );
                    await archivoFormatoJs.splice(buscandoProductoCarrito, 1);
                    let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                    await fs.promises.writeFile(data, archivoFormatoTxt);
                } else {
                    const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
                    const archivoFormatoJs = JSON.parse(lecturaArchivo);
                    await archivoFormatoJs.pop();
                    let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                    await fs.promises.writeFile(data, archivoFormatoTxt);
                }
            }
        } catch (err) {
            return { success: false, error: err };
        }
    }
    async deleteAll() {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
            let archivoFormatoJs = JSON.parse(lecturaArchivo);
            archivoFormatoJs = [];
            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
            await fs.promises.writeFile('./data/carrito.json', archivoFormatoTxt);
            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

const carritoConstructor = new carrito();

module.exports = { carrito };
