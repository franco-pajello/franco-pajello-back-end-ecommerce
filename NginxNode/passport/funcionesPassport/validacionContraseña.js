const bcript = require('bcrypt');

function isValidPassword(user, password) {
    return bcript.compareSync(password, user.password);
}
function createHash(password) {
    return bcript.hashSync(password, bcript.genSaltSync(10), null);
}

module.exports = { createHash, isValidPassword };
