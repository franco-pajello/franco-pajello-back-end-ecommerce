require('dotenv').config();
const { resultado } = require('./daos/iteradorDeInstancia.js');
const carritoConstructor = new resultado.carrito();
const objeto = new resultado.producto();
const chat = new resultado.chat();
const express = require('express');
const multer = require('multer');
const APP = express();
const PORT = process.env.PORT | require('./PORT/PORTSERVER.js');
/* const PORT = parseInt(process.env.argv[2]) | 8080; */
const http = require('http').createServer(APP);
const { Router } = express;
const rutaBase = Router();
const rutaCarrito = Router();
const cors = require('cors');
const io = require('socket.io')(http);
const faker = require('faker');
faker.locale = 'es';
const { commerce, image } = faker;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { store } = require('./cookies/cookiesMongo.js');
const { storeRedis } = require('./cookies/cookiesRedis.js');
const { isValidPassword } = require('./passport/funcionesPassport/validacionContraseña.js');
const { createHash, } = require('./passport/funcionesPassport/validacionContraseña.js');
const Usuarios = require('./models/usuarios.js');
const { connect } = require('mongoose');
const { logger } = require("./logs/logWinston.js");
const { url } = require('inspector');
//ADMIN
const admin = true;
//USUARIO SESSION
let usuarioLogeado = false;

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

/* APP.use('/public', express.static(__dirname + '/public')); */

APP.set('view engine', 'ejs');

APP.set('views', './views');
APP.use(
    session({
        secret: 'keyboard cat',
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 600, //un dia
        },
        rolling: true,
        resave: true,
        saveUninitialized: false,
    })
);
async function connectMG() {
    try {
        await connect(process.env.URLMONGO, { useNewUrlParser: true });
    } catch (e) {
        console.log(e);
        throw 'no me conecte';
    }
}
passport.use(
    'login',
    new LocalStrategy(async (username, password, done) => {
        await connectMG()
            .then(() => console.log('conectado'))
            .catch((err) => console.log('no conectado', err));
        Usuarios.findOne({ username: `${username}` }, (err, user) => {
            if (err) {
                console.log('login', err);
                return done(err);
            }
            if (!user) {
                console.log('no se encontro el usuario');
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                console.log('contraseña invalida');
                return done(null, false);
            }

            return done(null, user);
        });
    })
);

passport.use(
    'signup',
    new LocalStrategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            connectMG()
                .then(() => console.log('conectado'))
                .catch((err) => console.log('no conectado', err));
            Usuarios.findOne({ username: `${username}` }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    console.log('usuario existente');
                    return done(null, false);
                }
                const newUser = {
                    username: username,
                    password: createHash(password),
                };
                Usuarios.create(newUser, (err, userWintId) => {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    console.log(user);
                    console.log('usuario registrado');
                    return done(null, userWintId);
                });
            });
        }
    )
);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    Usuarios.findById(id, done);
});

rutaBase.use(
    session({
        store: store,
        secret: 'secreto',
        resave: false,
        saveUninitialized: false,
    })
);
APP.use(
    session({
        store: store,
        secret: 'secreto',
        resave: false,
        saveUninitialized: false,
    })
);
APP.use(
    session({
        store: storeRedis,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 86400000, //un dia
        },
        rolling: true,
        resave: true,
        secret: 'secreto',
        saveUninitialized: false,
    })
);
APP.use(passport.initialize());
APP.use(passport.session());

http.listen(PORT, () => {
    console.log(
        `servidor htpp escuchado em el puerto http://${process.env.LOCALHOST}:${PORT}/api/productos`
    );
});
rutaBase.get('', async (req, res) => {
    try {
        let productosArray = await objeto.getAll();
        /*    logger.log('info', "127.0.0.1 - log info", productosArray) */
        return res.render('pages/index', {
            producto: productosArray,
            usuarioLogeado: usuarioLogeado,
        });
        /*     res.json({ productosArray, admin }); */
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});
rutaBase.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        let buscandoProducto = await objeto.getById(id);
      
        if (buscandoProducto == false | buscandoProducto == null |buscandoProducto ==undefined) {
            res.redirect(`${id}`)
        } else {
            res.json(buscandoProducto);
        } 
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.redirect(`${id}`)
    }
}); 
APP.get('/showsession', (req, res) => {
    try {
        res.json(req.session);

    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});
APP.get('/faillogin', (req, res) => {
    try {

        res.render('partials/loginFail');
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});
APP.get('/failsignup', (req, res) => {
    try {

        res.render('partials/signupFail');
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});
APP.get('/login', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const { username, password } = req.user;
            const user = { username, password };
            let productosArray = await objeto.getAll();
            return res.render('pages/index', {
                producto: productosArray,
                usuarioLogeado: user,
            });
        } else {
            res.render('partials/login');
        }
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});

rutaBase.get("/info", (req, res) => {
    try {
        console.log("hola")
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
})
APP.get('/signup', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const { username, password } = req.body;
            const user = { username, password };
            return res.render('pages/index', {
                producto: productosArray,
                usuarioLogeado: user,
            });
        } else {
            res.render('partials/signup');
        }
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});

APP.get('/logout', async (req, res) => {
    //metodo post
    try {

        req.session.destroy((err) => {
            if (err) res.send('error inesperado');
            return res.redirect('http://127.0.0.1:8080/api/productos');
        });
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});
APP.post(
    '/signup',
    passport.authenticate('signup', {
        successRedirect: '/signup',
        failureRedirect: 'failsignup',
    })
);
APP.post(
    '/login',
    passport.authenticate('login', {
        successRedirect: '/login',
        failureRedirect: '/faillogin',
    })
);
rutaBase.post('/productosFaker', async (req, res) => {
    try {

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
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});
rutaBase.post(
    '/uploadfile',
    (req, res, next) => {
        if (admin == true) {
            next();
        } else {
            res.send({ error: 404, descripcion: 'no autorizado', método: 'post' });
        }
    },
    (req, res) => {
        try {

            const { body } = req;
            console.log(body);
            objeto.save({ ...body });

            res.json({ success: true, msg: 'producto cargado' });
        } catch (error) {
            logger.log('error', "127.0.0.1 - log error", error)
            res.json({ error: err });
        }
    }
);
//funciona por postman ↓

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
        try {

            const { id } = req.params;
            const { body } = req;
            await objeto.upDateById(id, body);
            res.send('ok');
        } catch (error) {
            logger.log('error', "127.0.0.1 - log error", error)
            res.json({ error: err });
        }
    }
);

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

        try {

            const { id } = req.params;

            let filtrandoProducto = await objeto.deleteById(id);
            if (filtrandoProducto == false) {
                res.json({ error: 'producto no encontrado' });
            } else {
                res.json({ success: true });
            }
        } catch (error) {
            logger.log('error', "127.0.0.1 - log error", error)
            res.json({ error: err });
        }
    }
);

//RUTAS DEL CARRITO

rutaCarrito.get('', async (req, res) => {
    try {
        let productosCarrito = await carritoConstructor.getAll();

        res.json(productosCarrito);
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});

rutaCarrito.post('', async (req, res) => {
    try {

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
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});

rutaCarrito.delete('/:id', async (req, res) => {
    try {

        const { id } = req.params;
        let filtrandoProducto = carritoConstructor.deleteById(id);

        if (filtrandoProducto == false) {
            res.json({ error: 'producto no encontrado' });
        } else {
            res.json({ success: true });
        }
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});

rutaCarrito.delete('', async (req, res) => {
    try {

        await carritoConstructor.deleteAll();
        res.json({ success: true });
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err });
    }
});

io.on('connection', (Socket) => {
    try {
        Socket.on('msg', async (data) => {
            await chat.save(data);
            const todoElChat = await chat.getAll();
            io.sockets.emit('chatLista', todoElChat);
        });
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: err, E: "aaaaaaaaaaaaaaaaaaaaaaaaa" });
    }
});

rutaBase.get('*', (req, res) => {
    try {
        let dataTime = new Date()
        logger.log('warn', "ruta inexistente", [{ path: req.path, Time: dataTime }])
        res.json({ error: 404, descripcion: 'solicitud no encontrada' });
    } catch (error) {
        logger.log('error', "127.0.0.1 - log error", error)
        res.json({ error: true, msg: error });
    }
});


