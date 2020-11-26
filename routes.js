const express = require('express');
const router = express.Router();

/** 
 * Define app controllers
 */

 const homeController = require('./Controllers/HomeController');
 const authController = require('./Controllers/AuthController');
 const galleryController = require('./Controllers/GalleryController');
 const userController = require('./Controllers/UserController');

 let routes = (app) => {
    router.get('/', homeController.index);
    router.get('/login', authController.login);
    router.post('/login', authController.signin);
    router.get('/register', authController.register);
    router.post('/register', authController.signup);
    router.get('/logout', authController.logout);

    router.get('/gallery', galleryController.index);
    router.get('/member', userController.index);
    app.use(router);
 };

 module.exports = routes;