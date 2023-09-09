import express from 'express';
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import productController from '../controllers/productController';
import cartController from '../controllers/cartController';
import authJWT from '../middleware/authJWT';

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './resources/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

let router = express.Router();

let initWebRouters = (app) => {
    // Check middleware
    router.all('*', authJWT.verifyToken, authJWT.verifyTokenAndAdminAuth);

    // Auth
    router.post('/api/signup', authController.handleSignUp);
    router.post('/api/signin', authController.handleSignIn);
    router.post('/api/signout', authController.handleSignOut);
    router.post('/auth/refresh', authController.handleRefreshToken);

    // Users
    router.post('/api/create_new_user', userController.handleCreateNewUser);
    router.get('/api/get_all_users', userController.handleGetAllUsers);
    router.get('/api/get_user_profile/:id', userController.handleGetProfile);
    router.put('/api/edit_user', userController.handleEditUser);
    router.delete('/api/delete_user', userController.handleDeleteUser);
    router.put('/api/update_avatar', userController.handleUpdateUserAvatar);
    router.get('/api/get_avatar/:id', userController.handleGetUserAvatar);

    // Products
    router.get('/resources/uploads/:pathImage', productController.getProductImage);
    router.get('/api/get_product/:id', productController.handleGetProduct);
    router.post('/api/post_products', upload.single('image'), productController.handlePostProduct);
    router.delete('/api/delete_product', productController.handleDeleteProduct);
    router.put('/api/edit_product', productController.handleEditProduct);

    // Carts
    router.post('/api/create_new_cart_item', cartController.handleCreateNewCartItem);
    router.get('/api/get_cart/:userId', cartController.handleGetCartByUserId);
    router.put('/api/update_cart', cartController.handleUpdateCart);
    router.delete('/api/delete_cart', cartController.handleDeleteCartProduct);

    return app.use('/', router);
};

module.exports = initWebRouters;
