const express = require('express');
const router = express.Router();
const {authenticatedOnly, unAuthenticatedOnly} = require('./Middleware/Auth');

/** 
 * Define app controllers
 */

 const homeController = require('./Controllers/HomeController');
 const authController = require('./Controllers/AuthController');
 const galleryController = require('./Controllers/GalleryController');
 const userController = require('./Controllers/UserController');

 let routes = (app) => {
    router.get('/', homeController.index);
    router.get('/login', unAuthenticatedOnly, authController.login);
    router.post('/login', unAuthenticatedOnly, authController.signin);
    router.get('/register', unAuthenticatedOnly, authController.register);
    router.post('/register', unAuthenticatedOnly, authController.signup);
    router.get('/logout', authenticatedOnly, authController.logout);

    router.get('/gallery', galleryController.index);
    router.get('/member', userController.index);
    router.get('/profile', authenticatedOnly, userController.profile);
    router.patch('/profile', [authenticatedOnly, userController.upload('avatar')], userController.updateProfile);
    router.post('/password', [authenticatedOnly, userController.validator('updatePassword')], userController.updatePassword);
    router.delete('/profile', authenticatedOnly, userController.deleteAccount);
    app.use(router);
 };

 module.exports = routes;