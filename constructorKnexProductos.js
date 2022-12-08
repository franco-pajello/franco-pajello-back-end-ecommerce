const { options } = require("./options/mysql.js");
const knex = require("knex")(options);


class productosKnex {
    constructor() {
        this.options = knex
        this.nombreTabla = "productos"
    }

    async save(obj) {

        try {
            await knex(`${this.nombreTabla}`)
                .insert(obj)
                .then(() => {
                    console.log("producto cargado");
                })
                .catch((err) => {
                    console.log(err);
                })

        } catch (e) {
            console.log(e)
        }

        return { success: true };
    }

    async getById(id) {
        try {

            const k = await knex
                .from("productos")
                .select("id", "=", `${id}`)
                .then(() => {
                    console.log("ok");
                })
                .catch((err) => {
                    console.log(err);
                })

            if (k) {
                return buscandoId;
            } else {
                return null
            }

        } catch (err) {
            return { success: false, error: err };
        }
    }

    async getAll() {
        try {
            const k = await knex
                .from(this.nombreTabla)
                .select("*")

            if (k.length >= 0) {
                return k
            } else {

                return []
            }


        } catch (err) {
            return { success: false, error: err };
        }
    }
    async deleteById(id) {


        await knex
            .from("productos")
            .where("id", "=", `${id}`)
            .del()


        return


        /*   try {
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
          } */
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

const constructorKnexProductos = new productosKnex();



module.exports = { productosKnex };

