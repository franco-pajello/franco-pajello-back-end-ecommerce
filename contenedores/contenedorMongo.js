const { model, connect } = require('mongoose');

async function connectMG() {
    try {
        await connect(
            'mongodb+srv://franco-pajello:tJ7LmKYYZwptLS9G@cluster0.8t2nx9j.mongodb.net/ecommerce  ',
            {
                useNewUrlParser: true,
            }
        );
    } catch (e) {
        console.log(e);
        throw 'no me conecte';
    }
}

class Contenedor {
    constructor(schema, modelo, nuevoElemento) {
        this.modelo = modelo;
        this.nuevoElemento = nuevoElemento;
        this.schema = model(schema, modelo);
    }

    async getAll() {
        connectMG();
        try {
            const arrayDeElementos = await this.schema.find({});
            return arrayDeElementos;
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async getById(id) {
        try {
            const TraerTodo = await this.schema.findById({ _id: `${id}` });

            return TraerTodo;
        } catch (err) {
            return { error: true, msg: err };
        }
    }
    async getByOne(id) {
        try {
            const TraerUno = await this.schema.findOne(id);
            return TraerUno;
        } catch (err) {
            return { error: true, msg: err };
        }
    }

    async save(elemento) {
        console.log(elemento);
        try {
            this.nuevoElemento(elemento);
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async deleteAll() {
        try {
            const TraerTodo = await this.getAll();
            for (const elemento of TraerTodo) {
                this.schema
                    .deleteOne({ _id: `${elemento._id}` })
                    .then((res) => {
                        console.log(res);
                        return { success: true, msg: 'elemento borrado' };
                    })
                    .catch((e) => {
                        console.log(e);
                        throw new err();
                    });
            }
        } catch (err) {
            return { success: false, error: err };
        }
    }

    async deleteById(id) {
        try {
            await this.schema
                .deleteOne({ _id: `${id}` })
                .then((res) => {
                    console.log(res);
                    return { success: true, msg: 'elemento borrado' };
                })
                .catch((e) => {
                    console.log(e);
                    throw new err();
                });
        } catch (err) {
            return { error: true, msg: 'no pudimos borra el producto' };
        }
    }

    async upDateById(id, body) {
        console.log(id, body);
        console.log(id, body.producto);
        await this.schema.updateOne(
            { _id: id },
            {
                $set: {
                    producto: body.producto,
                    precio: body.precio,
                    img_url: body.img_url,
                    stock: body.stock,
                },
            }
        );
    }
}
module.exports = { Contenedor };
