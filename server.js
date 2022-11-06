const fs = require('fs');
const express = require('express');
const multer = require('multer');
const data = './data/data.json';
const APP = express();
const PORT = process.env.PORT | 8080;
const { Router } = express;
const productosRuta = Router();

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));

APP.listen(PORT, () => {
    console.log(`servidor htpp escuchado em el puerto http://localhost:${PORT}`);
});

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

                return console.log(obj.id);
            } else {
                let arraryId = archivoFormatoJs.map((e) => e.id);

                let sumandoId = Math.max(...arraryId);

                obj.id = sumandoId + 1;

                archivoFormatoJs.push(obj);

                let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

                await fs.promises.writeFile(data, archivoFormatoTxt);

                return console.log(obj.id);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getById(id) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            let buscandoId = archivoFormatoJs.filter((e) => (e.id == id) | null);

            return buscandoId;
        } catch (error) {
            return false;
        }
    }

    async getAll() {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            return archivoFormatoJs;
        } catch (error) {
            console.error(error);
        }
    }
    async deleteById(id) {
        try {
            const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');

            const archivoFormatoJs = JSON.parse(lecturaArchivo);

            const buscamosElementoId = archivoFormatoJs.find((e) => e.id == id);

            const indice = archivoFormatoJs.indexOf(buscamosElementoId);

            await archivoFormatoJs.splice(indice, 1);

            let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);

            await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);

            return archivoFormatoJs;
        } catch (error) {
            return false;
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
        } catch (error) {
            console.log(error);
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
APP.use('/productos', productosRuta);

APP.get('/', (req, res) => {
    res.send('hello wordd');
});

APP.get('/uploadfile', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname +
            '-' +
            Date.now() +
            '.' +
            file.originalname.split('.').pop()
        );
    },
});
const upload = multer({ storage: storage });

APP.post('/uploadfile', upload.single('myFile'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.send({ error: true });
    } else {
        const { body } = req;

        objeto.save({ ...body, img: file.filename, path: file.path });
        res.json({ success: true, msj: 200 });
    }
});

productosRuta.get('', (req, res) => {
    objeto
        .getAll()
        .then((resp) => {
            res.json(resp);
        })
        .catch((error) => {
            console.error(error);
        });
});
productosRuta.get('/productosRandom', (req, res) => {
    objeto
        .getRandom()
        .then((resp) => {
            res.json(resp);
        })
        .catch((error) => {
            res.json({ error: 'error 404' });
        });
});

productosRuta.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    let todosLosProductos = await objeto.getAll();
    const indiceEncontrado = todosLosProductos.findIndex(
        (producto) => producto.id == id
    );
    todosLosProductos[indiceEncontrado] = body;

    const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
    let archivoFormatoJs = JSON.parse(lecturaArchivo);
    archivoFormatoJs = todosLosProductos;
    let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
    await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);

    res.send('ok');
});
productosRuta.get('/:id', async (req, res) => {
    const { id } = req.params;

    let buscandoProducto = await objeto.getById(id);
    if (buscandoProducto == false) {
        res.json({ error: 400, msj: 'solicitud no encontrada' });
    } else {
        res.json(buscandoProducto);
    }
});
productosRuta.delete('/:id', async (req, res) => {
    const { id } = req.params;

    let filtrandoProducto = objeto.deleteById(id);

    if (filtrandoProducto == false) {
        res.json({ error: 'producto no encontrado' });
    } else {
        res.json({ success: true });
    }
});
