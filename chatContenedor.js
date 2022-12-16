const { options } = require("./options/sqlite3.js");
const knex = require("knex")(options);

class Chat {
    constructor(nombre) {
        this.nombre = nombre;
        this.nombreTabla = "chat"
        this.options = knex
    }

    async save(dataChat) {
        try {
            await knex(`${this.nombreTabla}`)
                .insert(dataChat)
                .then(() => {
                    console.log("chat insertado");
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (e) {
            console.log(e)

        }

        return { success: true };

    }
    async getAll() {
        try {
            const k = await knex
                .from(`${this.nombreTabla}`)
                .select("*")

            if (k.length >= 0) {
                return k
            } else {

                return [];
            }


        } catch (err) {
            return { success: false, error: err };
        }
    }
}

const chatConstructor = new Chat();

module.exports = { Chat };






/* const fs = require('fs');
const data = './data/chat.json';

class Chat {
    constructor(nombre) {
        this.nombre = nombre;
    }

    async save(dataChat) {
        try {
            await knex(`${this.nombreTabla}`)
                .insert(dataChat)
                .then(() => {
                    console.log("chat insertado");
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (e) {
            console.log(e) */
/*             const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
 
            const archivoFormatoJs = JSON.parse(lecturaArchivo);
 
            archivoFormatoJs.push(dataChat);
 
            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
 
            await fs.promises.writeFile(data, archivoFormatoTxt);
 
            return { success: true };
        } catch (err) {
            return { success: false, error: err }
 
            */
/*         }
    }
    async getAll() {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            return archivoFormatoJs;
        } catch (err) {
            return { success: false, error: err }
        }
    }
}

const chatConstructor = new Chat();

module.exports = { Chat }; */