const yargs = require('yargs/yargs')(process.argv.slice(2));
const argvs = yargs.default({ port: 8080 }).argv;
module.exports = argvs.port;
