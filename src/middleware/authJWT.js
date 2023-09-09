import jwt from 'jsonwebtoken';

const verifyTokenPaths = [
    '/api/create_new_cart_item',
    '/api/get_cart/:userId',
    '/api/delete_cart',
    '/api/get_user_profile/:id',
    '/api/get_avatar/:id'
];
const verifyAdminPaths = [
    '/api/create_new_user',
    '/api/get_all_users',
    '/api/edit_user',
    '/api/delete_user',
    '/api/post_products',
    '/api/delete_product',
    '/api/edit_product'
];

const authJWT = {
    // verify Token
    verifyToken: (req, res, next) => {
        if (verifyTokenPaths.includes(req.path)) {
            console.log('check headers: ', req.headers);
            const tokenBearer = req.headers.authorization;
            console.log('check token bearer line 10: ', tokenBearer);
            if (tokenBearer && tokenBearer.split(' ')[0] === 'Bearer') {
                const accessToken = tokenBearer.split(' ')[1];
                jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                    if (err) {
                        return res.status(403).json({
                            message: 'Token is not valid !'
                        });
                    }
                    req.user = user;
                    next();
                });
            } else {
                return res.status(401).json({
                    message: 'You are not authenticated !'
                });
            }
        } else {
            return next();
        }
    },

    // verify Admin
    verifyTokenAndAdminAuth: (req, res, next) => {
        if (verifyAdminPaths.includes(req.path)) {
            authJWT.verifyToken(req, res, () => {
                if (req.user.role === 'Admin') {
                    next();
                } else {
                    res.status(403).json({
                        message: 'You are not allowed to sign in as an admin !'
                    });
                }
            });
        } else {
            return next();
        }
    }
};

module.exports = authJWT;
