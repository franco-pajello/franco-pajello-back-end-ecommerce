const fs = require("fs");
const data = './data/data.json';
const express = require("express");
const APP = express()
const PORT = process.env.PORT | 8080


class productos {
    constructor(nombre) {
        this.nombre = nombre

    }

    async save(obj) {

        try {
            const lecturaArchivo = await fs.promises.readFile(data, "utf-8");

            const archivoFormatoJs = JSON.parse(lecturaArchivo);


            if (archivoFormatoJs.length == 0) {

                obj.id = 1;
                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(data, archivoFormatoTxt);

                return console.log(obj.id);

            }

            else {

                let arraryId = archivoFormatoJs.map(e => e.id);

                let sumandoId = Math.max(...arraryId);

                obj.id = sumandoId + 1;

                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(data, archivoFormatoTxt);

                return console.log(obj.id);
            }
        }
        catch (e) {
            console.log(e);

        }

    }

    async getById(id) {
        try {

            const lecturaArchivo = await fs.promises.readFile(data, "utf-8");

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            let buscandoId = archivoFormatoJs.filter(e => e.id === id | null);

            console.log(buscandoId);
        } catch (error) {
            console.log(error);
        }
    }

    async getAll() {
        try {

            const lecturaArchivo = await fs.promises.readFile(data, "utf-8");

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            return archivoFormatoJs;
        } catch (error) {
            console.log(error);
        }
    }
    async deleteById(id) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, "utf-8");

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            const buscamosElementoId = archivoFormatoJs.find((e) => e.id === id);

            const indice = archivoFormatoJs.indexOf(buscamosElementoId);

            await archivoFormatoJs.splice(indice, 1);

            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

            await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);

            return console.log(archivoFormatoJs);

        } catch (error) {
            console.log(error);

        }
    }
    async deleteAll() {
        try {

            const lecturaArchivo = await fs.promises.readFile(data, "utf-8");
            let archivoFormatoJs = JSON.parse(lecturaArchivo);
            archivoFormatoJs = [];
            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
            await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);
            return console.log(archivoFormatoJs);
        } catch (error) {
            console.log(error);
        }
    }
    async getRandom() {
        const lecturaArchivo = await fs.promises.readFile(data, "utf-8");

        const archivoFormatoJs = JSON.parse(lecturaArchivo);

        let objRandom = archivoFormatoJs[Math.floor(Math.random() * archivoFormatoJs.length)];

        return objRandom;

    }
}

const objeto = new productos(data)

APP.get("/", (req, res) => {


    res.send("hello word")
})

APP.get("/productos", (req, res) => {

    objeto.getAll()
        .then(resp => {

            res.json(resp)
        })
        .catch(error => {
            console.error(error);
        })
})
APP.get("/productosRandom", (req, res) => {

    objeto.getRandom()
        .then(resp => {

            res.json(resp)
        })
        .catch(error => {
            console.error(error);
        })
})


APP.listen(PORT, () => {
    console.log(`servidor htpp escuchado em el puerto http://localhost:${PORT}`)
})


