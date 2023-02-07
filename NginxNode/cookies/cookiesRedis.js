require('dotenv').config();
const redis = require('redis');
const session = require('express-session');
const client = redis.createClient({ legacyMode: true });
client
    .connect()
    .then(() => console.log('conectado a redis'))
    .catch((err) => console.log(err));
const redisStore = require('connect-redis')(session);
const storeRedis = new redisStore({
    host: process.env.LOCALHOST,
    port: 6379,
    client,
    ttl: 300,
});
module.exports = { storeRedis };
