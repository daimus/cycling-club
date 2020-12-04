const bcrypt = require('bcrypt');

exports.passwordHash = (password, callback) => {
    if (typeof callback !== 'function'){
        return;
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return callback(err, null);
        }
        bcrypt.hash(password, salt, (err, hash) => {
            return callback(err, hash);
        });
    });
}