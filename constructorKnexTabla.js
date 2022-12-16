const { options } = require("./options/mysql.js");
const knex = require("knex")(options);

class TablaKnex {
    constructor(nombreTabla, productoString, productoprecio, img_url, stock, cantidad) {
        this.nombreTabla = knex.schema
        this.nombreTabla = knex.schema
            .createTable(`${nombreTabla}`, (table) => {
                table.increments("id"),
                    table.string(`${this.productoString = productoString}`),
                    table.integer(`${this.productoprecio = productoprecio}`),
                    table.string(`${this.img_url = img_url}`),
                    table.integer(`${this.stock = stock}`),
                    table.integer(`${this.cantidad = cantidad}`);
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



const newTabla = new TablaKnex("productos", "producto", "precio", "img_url", "stock", "cantidad");