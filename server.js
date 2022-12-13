const express = require('express');
const multer = require('multer');
const productos = require('./productosContenedor');
const objeto = new productos.productos();
const chat = require('./chatContenedor.js');
const chatConstructor = new chat.Chat();
const APP = express();
const PORT = process.env.PORT | 8080;
const http = require('http').createServer(APP);
const { Router } = express;
const productosRuta = Router();
const io = require('socket.io')(http);
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

APP.use(express.json());

APP.use(express.urlencoded({ extended: true }));

APP.use('/productos', productosRuta);

APP.use('/public', express.static(__dirname + '/public'));

APP.set('view engine', 'ejs');

APP.set('views', './views');

http.listen(PORT, () => {
    console.log(`servidor htpp escuchado em el puerto http://localhost:${PORT}`);
});

APP.get('/', async (req, res) => {
    try {
        let productosArray = await objeto.getAll();

        res.render('pages/index', { producto: productosArray });
    } catch (err) {
        res.json({ error: err });
    }
});

/* APP.post('/uploadfile', upload.single('myFile'), (req, res) => {
    const file = req.file;
    if (!file) {
        res.send({ error: true });
    } else {
        const { body } = req;

        objeto.save({ ...body, img: file.ruta, path: file.path });

        res.redirect('http://localhost:8080');
    }
}); */

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

productosRuta.get('/:id', async (req, res) => {
    const { id } = req.params;

    let buscandoProducto = await objeto.getById(id);
    if (buscandoProducto == false) {
        res.json({ error: 400, msj: 'solicitud no encontrada' });
    } else {
        res.json(buscandoProducto);
    }
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

productosRuta.delete('/:id', async (req, res) => {
    const { id } = req.params;

    let filtrandoProducto = objeto.deleteById(id);

    if (filtrandoProducto == false) {
        res.json({ error: 'producto no encontrado' });
    } else {
        res.json({ success: true });
    }
});

io.on('connection', (Socket) => {
    Socket.on('prodActualizado', async (data) => {
        const subiendoObjeto = await objeto.save(data);
        const obteniendoObjeto = await objeto.getAll();

        io.sockets.emit('producList', obteniendoObjeto);
    });

    Socket.on('msg', async (data) => {
        await chatConstructor.save(data);
        const todoElChat = await chatConstructor.getAll();
        console.log(todoElChat)
        io.sockets.emit('chatLista', todoElChat);
    });
});
