const fs = require('fs');
const data = './data/data.json';

class productos {
    constructor(nombre) {
        this.nombre = nombre;
    }

    async save(obj) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            if (archivoFormatoJs.length == 0) {
                obj.id = 1;
                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(data, archivoFormatoTxt);

                return { success: true };
            } else {
                let arraryId = archivoFormatoJs.map((e) => e.id);

                let sumandoId = Math.max(...arraryId);

                obj.id = sumandoId + 1;

                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(data, archivoFormatoTxt);

                return { success: true };
            }
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async getById(id) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            let buscandoId = archivoFormatoJs.filter((e) => (e.id == id) | null);

            return buscandoId;
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

            const buscamosElementoId = await archivoFormatoJs.find((e) => e.id == id);

            const indice = archivoFormatoJs.indexOf(buscamosElementoId);

            await archivoFormatoJs.splice(indice, 1);

            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

            await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);

            return archivoFormatoJs;
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
            await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);
            return console.log(archivoFormatoJs);
        } catch (err) {
            return { success: false, error: err };
        }
    }
    async getRandom() {
        const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

        const archivoFormatoJs = JSON.parse(lecturaArchivo);

        let objRandom =
            archivoFormatoJs[Math.floor(Math.random() * archivoFormatoJs.length)];

        return objRandom;
    }
}

const objeto = new productos();

module.exports = { productos };
