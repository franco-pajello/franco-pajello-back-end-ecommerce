const fs = require('fs');
class Contenedor {
    constructor(ruta) {
        this.ruta = ruta;
    }

    async getAll() {
        try {
            const lecturaArchivo = await fs.promises.readFile(this.ruta, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async getById(id) {
        try {
            const archivoFormatoJs = await this.getAll();

            let buscandoId = archivoFormatoJs.find((e) => e.id == id);

            return buscandoId;
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async save(obj) {
        try {
            console.log(obj);
            const archivoFormatoJs = await this.getAll();
            if (archivoFormatoJs.length == 0) {
                obj.id = 1;
                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(this.ruta, archivoFormatoTxt);

                return { success: true };
            } else {
                let arraryId = archivoFormatoJs.map((e) => e.id);

                let sumandoId = Math.max(...arraryId);

                obj.id = sumandoId + 1;

                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(this.ruta, archivoFormatoTxt);

                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async deleteAll() {
        try {
            const archivoFormatoJs = await this.getAll();
            archivoFormatoJs = [];
            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
            await fs.promises.writeFile(this.ruta, archivoFormatoTxt);
            return console.log(archivoFormatoJs);
        } catch (err) {
            return { success: false, error: err };
        }
    }
    async deleteById(id) {
        try {
            const archivoFormatoJs = await this.getAll();

            const buscamosElementoId = await archivoFormatoJs.find((e) => e.id == id);

            const indice = archivoFormatoJs.indexOf(buscamosElementoId);

            await archivoFormatoJs.splice(indice, 1);

            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

            await fs.promises.writeFile(this.ruta, archivoFormatoTxt);

            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err };
        }
    }
    async upDateById(id, body) {
        let todosLosProductos = await this.getAll();

        const indiceEncontrado = await todosLosProductos.findIndex(
            (producto) => producto.id == id
        );

        todosLosProductos[indiceEncontrado] = body;

        const lecturaArchivo = await fs.promises.readFile(this.ruta, 'utf-8');
        let archivoFormatoJs = await JSON.parse(lecturaArchivo);
        archivoFormatoJs = todosLosProductos;
        let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
        await fs.promises.writeFile(this.ruta, archivoFormatoTxt);

        return { success: true };
    }
}

module.exports = { Contenedor };
