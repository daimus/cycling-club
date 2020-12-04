const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { passwordHash } = require('../Utils/Hash');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String,
        default: 'default.jpg'
    }
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    console.log('pre save');
    const user = this;
    passwordHash(user.password, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        cb(err, isMatch);
    });
}

const User = mongoose.model('User', userSchema);

module.exports = User;