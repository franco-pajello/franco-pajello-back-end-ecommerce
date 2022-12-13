const { options } = require("./options/sqlite3.js");
const knex = require("knex")(options);

class Chat {
    constructor(nombre) {
        this.nombre = nombre;
        this.nombreTabla = "chat"
        this.options = knex
    }

    async save(dataChat) {

        console.log(dataChat)

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
