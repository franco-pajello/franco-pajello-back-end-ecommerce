const mongoStore = require('connect-mongo');
const store = mongoStore.create({
    mongoUrl:
        'mongodb+srv://franco-pajello:cS8dwKGmiFHrXqU3@cluster0.cbaaafe.mongodb.net/',
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ttl: 60,
});
console.log('mongoCookie');
module.exports = { store };
