import cartService from '../services/cartService';
import Cart from '../models/Cart';

// Add a product to cart
let handleCreateNewCartItem = async (req, res) => {
    try {
        await Cart.sync();
        let cart = await cartService.createNewCartItem(req.body);
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing input parameters !'
        });
    }
};

let handleGetCartByUserId = async (req, res) => {
    let userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Invalid user ! Please create new user !'
        });
    }

    let cart = await cartService.getCart(userId);
    return res.status(200).json(cart);
};

let handleUpdateCart = async (req, res) => {
    try {
        let data = req.body;
        let size = data.size;
        if (!size) {
            return res.status(400).json({
                errCode: 2,
                message: 'Missing size !'
            });
        }
        let countUniqueProduct = data.countUniqueProduct;
        if (!countUniqueProduct) {
            return res.status(400).json({
                errCode: 3,
                message: 'Missing count !'
            });
        }
        let updatedCart = await cartService.updateCart(data);
        return res.status(200).json(updatedCart);
    } catch (error) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing size or count parameter !'
        });
    }
};

let handleDeleteCartProduct = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({
                errCode: 1,
                message: 'Can not found this product in cart !'
            });
        }
        let deleteCart = await cartService.deleteCartProduct(req.body.id);
        return res.status(200).json(deleteCart);
    } catch (error) {
        return res.status(400).json({
            errCode: 1,
            message: 'Fail to remove product in cart !'
        });
    }
};

module.exports = {
    handleCreateNewCartItem: handleCreateNewCartItem,
    handleGetCartByUserId: handleGetCartByUserId,
    handleUpdateCart: handleUpdateCart,
    handleDeleteCartProduct: handleDeleteCartProduct
};
