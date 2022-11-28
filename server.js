const productos = require('./productosContenedor');
const fs = require('fs');
const data = './data/carrito.json';
const chat = require('./chatContenedor');
const express = require('express');
const multer = require('multer');
const objeto = new productos.productos();
const chatConstructor = new chat.Chat();
const carrito = require('./contenedorCarrito');
const carritoConstructor = new carrito.carrito();
const APP = express();
const PORT = process.env.PORT | 8080;
const http = require('http').createServer(APP);
const { Router } = express;
const rutaBase = Router();
const rutaCarrito = Router();
const io = require('socket.io')(http);

//ADMIN
const admin = true;

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

APP.use('/api/productos', rutaBase);

APP.use('/api/carrito', rutaCarrito);

APP.use('/public', express.static(__dirname + '/public'));

APP.set('view engine', 'ejs');

APP.set('views', './views');

http.listen(PORT, () => {
    console.log(
        `servidor htpp escuchado em el puerto http://localhost:${PORT}/api/productos`
    );
});
//probar por frontend
//para probar en postan activar lo comentado dentro del try
rutaBase.get('', async (req, res) => {
    try {
        let productosArray = await objeto.getAll();

        res.render('pages/index', { producto: productosArray, admin: admin });
        //para probar con postman
        // res.json(productosArray)
    } catch (err) {
        res.json({ error: err });
    }
});

//probar por postman
rutaBase.get('/:id', async (req, res) => {
    const { id } = req.params;

    let buscandoProducto = await objeto.getById(id);
    if (buscandoProducto == false) {
        res.json({ error: 400, msj: 'solicitud no encontrada' });
    } else {
        res.json(buscandoProducto);
    }
});

//probar por frontend
APP.post(
    '/uploadfile',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', método: 'post' });
        }
    },
    upload.single('myFile'),
    (req, res) => {
        const file = req.file;
        console.log(file);
        if (!file) {
            res.send({ error: true });
        } else {
            const { body } = req;

            objeto.save({ ...body, img: file.filename });

            res.redirect('http://localhost:8080');
        }
    }
);

//probar por postman
rutaBase.put(
    '/:id',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', método: 'post' });
        }
    },
    async (req, res) => {
        const { id } = req.params;
        const { body } = req;
        let todosLosProductos = await objeto.getAll();
        const indiceEncontrado = todosLosProductos.findIndex(
            (producto) => producto.id == id
        );

        todosLosProductos[indiceEncontrado] = body;

        const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
        let archivoFormatoJs = await JSON.parse(lecturaArchivo);
        archivoFormatoJs = todosLosProductos;
        let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
        await fs.promises.writeFile('./data/data.json', archivoFormatoTxt);

        res.send('ok');
    }
);

rutaBase.get('/productosRandom', (req, res) => {
    objeto
        .getRandom()
        .then((resp) => {
            res.json(resp);
        })
        .catch((error) => {
            res.json({ error: 'error 404' });
        });
});

//probar por postman
rutaBase.delete(
    '/:id',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', método: 'post' });
        }
    },
    async (req, res) => {
        const { id } = req.params;

        let filtrandoProducto = objeto.deleteById(id);

        if (filtrandoProducto == false) {
            res.json({ error: 'producto no encontrado' });
        } else {
            res.json({ success: true });
        }
    }
);

io.on('connection', (Socket) => {
    /*     Socket.on('prodActualizado', async (data) => {
                    const subiendoObjeto = await objeto.save(data);
                    const obteniendoObjeto = await objeto.getAll();
            
                    io.sockets.emit('producList', obteniendoObjeto);
                }); */

    Socket.on('msg', async (data) => {
        await chatConstructor.save(data);
        const todoElChat = await chatConstructor.getAll();
        io.sockets.emit('chatLista', todoElChat);
    });
});

//probar en frontend

rutaCarrito.get('', async (req, res) => {
    try {
        let productosCarrito = await carritoConstructor.getAll();

        res.render('pages/carritoIndex', { productoCarrito: productosCarrito });
    } catch (err) {
        res.json({ error: err });
    }
});
//probar en frontend
rutaCarrito.post('', async (req, res) => {
    const todosLosProductosDb = await objeto.getAll();

    const { body } = req;

    const obteniendoId = await body.a;

    const buscandoProductoDb = await todosLosProductosDb.find(
        (producto) => producto.id == obteniendoId
    );
    await carritoConstructor.save(buscandoProductoDb);

    return;
});
//probar en frontend
// f5 por cada item elimnado
rutaCarrito.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let filtrandoProducto = carritoConstructor.deleteById(id);

    if (filtrandoProducto == false) {
        res.json({ error: 'producto no encontrado' });
    } else {
        res.json({ success: true });
    }
});
//probar en frontend
// f5 despues de vaciar el carrito
rutaCarrito.delete('', async (req, res) => {
    await carritoConstructor.deleteAll();
});
