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
    '/api/edit_user',
    '/api/delete_user',
    '/api/post_products',
    '/api/delete_product',
    '/api/edit_product'
];

const authJWT = {
    // Verify Access token
    verifyToken: async (req, res, next) => {
        if (verifyTokenPaths.includes(req.path)) {
            const tokenBearer = await req.headers.authorization;
            console.log('check bearer token: ', tokenBearer);
            if (tokenBearer && tokenBearer.split(' ')[0] === 'Bearer') {
                const accessToken = tokenBearer.split(' ')[1];
                try {
                    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                    req.user = user;
                    next();
                } catch (error) {
                    return res.status(403).json({
                        message: 'Token is not valid !'
                    });
                }
            } else {
                return res.status(401).json({
                    message: 'You are not authenticated !'
                });
            }
        } else {
            return next();
        }
    },

    // Verify Admin Role
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
