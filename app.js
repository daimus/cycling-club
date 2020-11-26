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
 
 /**
  * Create express server
  */

  const app = express();

  /**
   * Express configuration
   */

   app.use(express.static('public'));
   app.set('view engine', 'ejs');
   app.use(bodyParser.urlencoded({extended: false}));
   app.use(bodyParser.json());
   app.use(cookieParser('secret'));
   app.use(session({cookie: {maxAge: 60000}}));
   app.use(flash());
   app.use(methodOverride('_method'));

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
       console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
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

   app.listen(3000, () => {
    console.log('App is running on port 3000');
    console.log('Press Ctrl+C to stop');
});