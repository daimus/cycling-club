const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../Models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Local Strategy
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    User.findOne({ email: email.toLocaleLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user){
            return done(null, false, { message: 'User not found' });
        }
        if (!user.password) {
            return done(null, false, {message: 'Sign in provider'});
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(null, user);
            }
            return done(null, false, {message: 'Invalid password'});
        });
    });
}));