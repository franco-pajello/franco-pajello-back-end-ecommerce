const ProductosDaoArchivos =
    require('./productos/productoDaoArchivo.js').productoDaoArchivo;
const ProductosDaoMongo =
    require('./productos/productoDaoMongo.js').ProductoDaosMongo;
const productoDaoFirebase =
    require('./productos/productoDaoFirebase.js').PoductosDaosFirebase;
const carritoDaoArchivos = require('./carrito/carritoDaoArchivo.js').carrito;
const carritoDaoMongo =
    require('./carrito/carritoDaoMongo.js').CarritoDaosMongo;
const carritoDaoFirebase =
    require('./carrito/carritoDaoFirebase.js').CarritoDaosFirebase;
const chatDaoArchivo = require('./chat/chatArchivo.js').chatDaosArchivo;
const chatDaoMongo = require('./chat/chatDaoMongo.js').chatDaosMongo;
const { config } = require('dotenv');
config();

const instancias = [
    {
        nombre: ProductosDaoArchivos,
        id: 'archivo',
        descripcion: 'producto',
    },
    {
        nombre: carritoDaoArchivos,
        id: 'archivo',
        descripcion: 'carrito',
    },
    {
        nombre: ProductosDaoMongo,
        id: 'mongo',
        descripcion: 'producto',
    },
    {
        nombre: carritoDaoMongo,
        id: 'mongo',
        descripcion: 'carrito',
    },
    {
        nombre: productoDaoFirebase,
        id: 'firebase',
        descripcion: 'producto',
    },
    {
        nombre: carritoDaoFirebase,
        id: 'firebase',
        descripcion: 'carrito',
    },
    {
        nombre: chatDaoArchivo,
        id: 'archivo',
        descripcion: 'chat',
    },
    {
        nombre: chatDaoMongo,
        id: 'mongo',
        descripcion: 'chat',
    },
];

const instancia = instancias.filter((i) => i.id == process.env.INSTANCIA);
const resultado = {
    [instancia[0].descripcion]: instancia[0].nombre,
    [instancia[1].descripcion]: instancia[1].nombre,
    [instancia[2].descripcion]: instancia[2].nombre,
};

module.exports = { resultado };
