/**
 * Call required module
 */

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const flash = require('express-flash');
const mongoose = require('mongoose');
const multer = require('multer');
const methodOverride = require('method-override');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

/**
 * Create express server
 */

const passportConfig = require('./Config/Passport');
const app = express();

/**
 * Express configuration
 */

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true
    })
}));
app.use(flash());
app.use(methodOverride('_method'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.alert = req.flash('alert');
    next();
});
/**
 * Create connection to mongodb
 */

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});

/** 
 * Define application route
 */

const initRoutes = require('./routes');
initRoutes(app);

/** 
 * Start express server
 */

app.listen(process.env.APP_PORT, () => {
    console.log(`App is running on port ${process.env.APP_PORT}`);
});