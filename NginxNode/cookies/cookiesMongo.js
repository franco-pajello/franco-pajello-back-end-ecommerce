const mongoStore = require('connect-mongo');
require('dotenv').config();
const store = mongoStore.create({
    mongoUrl: process.env.URLCOOKIEMONGO,
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ttl: 60,
});
console.log('mongoCookie');
module.exports = { store };
