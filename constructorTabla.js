const { options } = require("./options/sqlite3.js");
const knex = require("knex")(options);

class TablaKnex {
    constructor(nombreTabla, fecha, email, msj) {
        this.nombreTabla = knex.schema
            .createTable(`${nombreTabla}`, (table) => {
                table.increments("id"),
                    table.string(`${this.fecha = fecha}`),
                    table.string(`${this.email = email}`),
                    table.string(`${this.msj = msj}`)
            })
            .then(() => {
                console.log("tabla creada");
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                knex.destroy();
            });
    }

}


const newTabla = new TablaKnex("chat", "fecha", "email", "msj");