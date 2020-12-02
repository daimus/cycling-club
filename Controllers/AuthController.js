const { use } = require("passport");
const passport = require("passport");
const User = require("../Models/User");


exports.login = (req, res) => {
    res.render('auth/login');
}

exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err){
            return next(err);
        }
        if (!user){
            req.flash('alert', {message: info.message, status: 'danger', title: 'Ouch!'});
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err){
                return next(err);
            }
            req.flash('alert', {message: 'Welcome back to our club!', status: 'success', title: 'Success!'});
            res.redirect('/');
        });
    })(req, res, next);
}

exports.register = (req, res) => {
    res.render('auth/register');
}

exports.signup = (req, res, next) => {
    const user = new User(req.body);

    User.findOne({email: req.body.email}, (err, existingUser) => {
        if (err) {
            console.log('findoneerr: ', err);
            return next(err);
        }
        if (existingUser){
            console.log('existinguser: ', existingUser);
            req.flash('alert', {message: `${user.email} already registered. Please login with correct credentials`, status: 'danger', title: 'Ouch!'})
            return res.redirect('/login');
        }
        user.save((err) => {
            if (err){
                console.log('err: ',err);
                return next(err);
            }
            console.log('save ok');
            // authenticate user
            req.logIn(user, (err) => {
                if (err){
                    console.log('err: ', err);
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
}

exports.logout = (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err){
            console.log('Failed to destroy session: ', err);
        }
        req.user = null;
        res.redirect('/');
    });
}