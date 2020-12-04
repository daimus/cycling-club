const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const User = require('../Models/User');
const {passwordHash} = require('../Utils/Hash');

exports.upload = (method) => {
    switch (method) {
        case 'avatar': {
            return multer({
                storage: multer.diskStorage({
                    destination: path.join('./public/uploads/avatars/'),
                    filename: function (req, file, cb) {
                        cb(null, Date.now() + path.extname(file.originalname));
                    }
                })
            }).single('avatar');
        }
    }
}

exports.validator = (method) => {
    switch (method) {
        case 'updatePassword': {
            return [

                body('new_password').exists(),
                body('confirm_password').custom((value, { req }) => {
                    if (value !== req.body.new_password) {
                        throw new Error('Password conformation does not match');
                    }
                    return true;
                })
            ]
        }
    }
}

exports.index = (req, res) => {
    const q = (req.query.q == undefined) ? '' : req.query.q;
    User.find({name: { '$regex' : q, '$options' : 'i' }}, (err, users) => {
        if (err){
            throw err;
        }
        console.log(users);
        res.render('user/index', {users: users});
    });
}

exports.profile = (req, res) => {
    res.render('user/profile');
}

exports.updateProfile = (req, res, next) => {
    const user = {
        name: req.body.name,
        email: req.body.email
    }
    if (req.file !== undefined && req.file !== null) {
        user.avatar = req.file.filename;
    }
    console.log('req body: ', req.body);
    User.findOneAndUpdate({ _id: req.body.id }, user, (err) => {
        if (err) {
            console.log(err);
            req.flash('alert', { message: err, status: 'danger' });
            next();
        }
        req.flash('alert', { message: 'Profile updated successfully', status: 'success' });
        res.redirect('/profile');
    });
}

exports.updatePassword = (req, res, next) => {
    const errors = validationResult(req);
    console.log('validation result: ', errors);
    console.log('body: ', req.body);
    passwordHash(req.body.new_password, (err, hash) => {
        if (err){
            req.flash('alert', { message: err.toString(), status: 'danger' });
            return res.redirect('/profile#password');
        }
        User.findByIdAndUpdate(req.body.id, { password: hash }, (err, user) => {
            console.log(err);
            if (err) {
                req.flash('alert', { message: err.toString(), status: 'danger' });
            } else {
                req.flash('alert', { message: 'Password updated successfully', status: 'success' });
            }
            res.redirect('/profile#nav-password');
        });
    });

    console.log('end');
}

exports.deleteAccount = (req, res) => {
    console.log(req.body);
    User.findByIdAndDelete(req.body.id, (err) => {
        if (err) {
            req.flash('alert', { message: err.toString(), status: 'danger' });
        } else {
            req.flash('alert', { message: 'Account deleted successfully', status: 'success' });
        }
        res.redirect('/logout');
    });
}