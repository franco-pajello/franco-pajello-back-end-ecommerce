const { resultado } = require('./daos/iteradorDeInstancia.js');
const carritoConstructor = new resultado.carrito();
const objeto = new resultado.producto();
const chat = new resultado.chat();
const express = require('express');
const multer = require('multer');
const APP = express();
const PORT = process.env.PORT | 8080;
const http = require('http').createServer(APP);
const { Router } = express;
const rutaBase = Router();
const rutaCarrito = Router();
const cors = require('cors');
const io = require('socket.io')(http);
const faker = require('faker');
faker.locale = 'es';
const { commerce, image } = faker;

//ADMIN
const admin = false;

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
/* const upload = multer({ storage: storage }); */

APP.use(express.json());

APP.use(express.urlencoded({ extended: true }));

APP.use(cors({ origin: '*' }));

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

APP.post('/productosFaker', async (req, res) => {
    const { body } = req;
    const cant = body.id;
    for (let index = 0; index < cant; index++) {
        //arme el obj segun el modelo correspondiente

        const arrayFakeProducto = {
            producto: commerce.product(),
            precio: JSON.parse(commerce.price(50, 5000)),
            img_url: `${image.image()}`,
            stock: faker.datatype.number(100),
            cantidad: 1,
        };
        await objeto.save(arrayFakeProducto);
    }
    res.json({ success: true, msg: 'producto cargado' });
});

rutaBase.get('', async (req, res) => {
    try {
        let productosArray = await objeto.getAll();
        res.render('pages/index', { producto: productosArray });
        /*   res.json({ productosArray, admin }); */
    } catch (err) {
        res.json({ error: err });
    }
});

rutaBase.get('/:id', async (req, res) => {
    const { id } = req.params;
    let buscandoProducto = await objeto.getById(id);
    if (buscandoProducto == false) {
        res.json({ error: 400, msj: 'solicitud no encontrada' });
    } else {
        res.json(buscandoProducto);
    }
});

APP.post(
    '/uploadfile',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', m??todo: 'post' });
        }
    },
    (req, res) => {
        const { body } = req;
        console.log(body);
        objeto.save({ ...body });
        res.json({ success: true, msg: 'producto cargado' });
    }
);
//funciona por postman ???

rutaBase.put(
    '/:id',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', m??todo: 'post' });
        }
    },
    async (req, res) => {
        const { id } = req.params;
        const { body } = req;
        await objeto.upDateById(id, body);
        res.send('ok');
    }
);

rutaBase.delete(
    '/:id',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', m??todo: 'post' });
        }
    },
    async (req, res) => {
        const { id } = req.params;

        let filtrandoProducto = await objeto.deleteById(id);
        if (filtrandoProducto == false) {
            res.json({ error: 'producto no encontrado' });
        } else {
            res.json({ success: true });
        }
    }
);

//RUTAS DEL CARRITO

rutaCarrito.get('', async (req, res) => {
    try {
        let productosCarrito = await carritoConstructor.getAll();

        res.json(productosCarrito);
    } catch (err) {
        res.json({ error: err });
    }
});

rutaCarrito.post('', async (req, res) => {
    const { body } = req;

    const id = await body.id;

    const buscandoProductoDbCarrito = await carritoConstructor.getById(id);

    if (
        buscandoProductoDbCarrito == undefined ||
        buscandoProductoDbCarrito == null
    ) {
        const buscandoProductoDb = await objeto.getById(id);
        await carritoConstructor.post({ ...buscandoProductoDb, id });
        const todo = await carritoConstructor.getAll();
        return todo;
    } else {
        const cargandoProducto = await carritoConstructor.post({
            ...buscandoProductoDbCarrito,
            id,
        });

        return cargandoProducto;
    }
});

rutaCarrito.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let filtrandoProducto = carritoConstructor.deleteById(id);

    if (filtrandoProducto == false) {
        res.json({ error: 'producto no encontrado' });
    } else {
        res.json({ success: true });
    }
});

rutaCarrito.delete('', async (req, res) => {
    await carritoConstructor.deleteAll();
    res.json({ success: true });
});

rutaBase.get('*', function (req, res) {
    res.json({ error: 404, descripcion: 'solicitud no encontrada' });
});

io.on('connection', (Socket) => {
    Socket.on('msg', async (data) => {
        await chat.post(data);
        const todoElChat = await chat.getAll();
        io.sockets.emit('chatLista', todoElChat);
    });
});
