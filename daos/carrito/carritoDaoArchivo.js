const contenedorRequire = require('../../contenedores/contenedorArchivos.js');
const data = './data/carrito.json';
const fs = require('fs');

class carrito extends contenedorRequire.Contenedor {
    constructor() {
        super(data);
    }

    async post(obj) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = await JSON.parse(lecturaArchivo);

            const buscandoProductoCarrito = await archivoFormatoJs.findIndex(
                (producto) => producto.id == obj.id
            );

            if (buscandoProductoCarrito < 0) {
                obj.cantidad = 1;
                await archivoFormatoJs.push(obj);
                console.log(archivoFormatoJs);

                const archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                await fs.promises.writeFile(this.ruta, archivoFormatoTxt);
                return archivoFormatoJs;
            } else {
                archivoFormatoJs[buscandoProductoCarrito].cantidad++;
                console.log(archivoFormatoJs[buscandoProductoCarrito].cantidad++);
                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                await fs.promises.writeFile(this.ruta, archivoFormatoTxt);
                return archivoFormatoJs;
            }
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

const carritoConstructor = new carrito();

module.exports = { carrito };
