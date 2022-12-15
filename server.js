<<<<<<< HEAD
/* <<<<<<< HEAD */
/* const fs = require('fs');
const data = './data/carrito.json'; */
/* const express = require('express');
const multer = require('multer');

const { options } = require("./options/mysql.js");
const productos = require('./productosContenedor.js');
const knexProductos = require("./constructorKnexProductos.js")
const constructorKnexProductos = new knexProductos.productosKnex()
const objeto = new productos.productos();
const carrito = require('./contenedorCarrito.js');
const carritoConstructor = new carrito.carrito();
const chatContenedor = require("./chatContenedor.js")
const chatConstructor = new chatContenedor.Chat()

======= */
=======
const productos = require('./productosContenedor');
const chat = require('./chatContenedor');
>>>>>>> parent of 784ae0d (socket.io con sqlite3)
const express = require('express');
const multer = require('multer');
const { Socket } = require('socket.io');
const objeto = new productos.productos();
const chatConstructor = new chat.Chat();
/* >>>>>>> 784ae0d */
const APP = express();
const http = require("http").createServer(APP);
const io = require("socket.io")(http);
const PORT = process.env.PORT | 8080;

const { Router } = express;
const rutaBase = Router();
const rutaCarrito = Router();

const cors = require('cors');
const knex = require("knex")(options);


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

APP.use(cors({ origin: '*' }));

APP.use('/api/productos', rutaBase);

APP.use('/api/carrito', rutaCarrito);

APP.use('/public', express.static(__dirname + '/public'));

http.listen(PORT, () => {
    console.log(
        `servidor htpp escuchado em el puerto http://localhost:${PORT}/api/productos`
    );
});

APP.get('*', function (req, res) {
    res.json({ error: 404, descripcion: 'solicitud no encontrada' });
});

rutaBase.get('', async (req, res) => {
    /*   res.sendFile(__dirname + "/index.html") */
    try {
        let productosArray = await constructorKnexProductos.getAll();
        res.json({ productosArray, admin });
    } catch (err) {
        res.json({ error: err });
    }
});

rutaBase.get('/:id', async (req, res) => {
    const { id } = req.params;
    let buscandoProducto = await constructorKnexProductos.getById(id);

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
            res.send({ error: 404, descripcion: 'no autorizado', método: 'post' });
        }
    },
    (req, res) => {

        const { body } = req;

        constructorKnexProductos.save({ ...body, img_url: body.img_url });
        /*    res.send('ok');  */
    }
);

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
        await knex
            .from("productos")
            .where("id", "=", `${id}`)
            .update(body)

        res.json({ success: "producto editado con exito" })



        /* 
                const indiceEncontrado = await todosLosProductos.findIndex(
                    (producto) => producto.id == id
                );
        
                       todosLosProductos[indiceEncontrado] = body;
                
                        const lecturaArchivo = await fs.promises.readFile(data, 'utf-8');
                        let archivoFormatoJs = await JSON.parse(lecturaArchivo);
                        archivoFormatoJs = todosLosProductos;
                        let archivoFormatoTxt = JSON.stringify(archivoFormatoJs);
                        await fs.promises.writeFile('./data/data.json', archivoFormatoTxt); 
        
                res.send('ok'); */
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


        await constructorKnexProductos.deleteById(id)

        res.json({ success: "producto borrado con exito" })
        /* 
                let filtrandoProducto = await objeto.deleteById(id);
        
                if (filtrandoProducto == false) {
                    res.json({ error: 'producto no encontrado' });
                } else {
                    res.json({ success: true });
                } */
    }
);

rutaCarrito.get('', async (req, res) => {
    try {
        let productosCarrito = await carritoConstructor.getAll();

        res.json(productosCarrito);
    } catch (err) {
        res.json({ error: err });
    }
});

rutaCarrito.post('', async (req, res) => {
    const todosLosProductosDb = await objeto.getAll();

    const { body } = req;

    const obteniendoId = await body.a;

    const buscandoProductoDb = await todosLosProductosDb.find(
        (producto) => producto.id == obteniendoId
    );

    const cargandoProducto = await carritoConstructor.save(buscandoProductoDb);

    return cargandoProducto;
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


/* io.on('connection', (Socket) => {
    Socket.on('msg', async (data) => {
        await chatConstructor.save(data);
        const todoElChat = await chatConstructor.getAll();
        io.sockets.emit('chatLista', todoElChat);
    });
});  */