import Cart from '../models/Cart';
import Product from '../models/Product';

let createNewCartItem = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let productCart = await Cart.findOne({
                where: { productId: data.productId, size: data.size }
            });

            if (!productCart) {
                let cartItem = await Cart.create({
                    userId: data.userId,
                    productId: data.productId,
                    countUniqueProduct: data.countUniqueProduct,
                    size: data.size
                });

                resolve({
                    errCode: 0,
                    message: 'done',
                    data: cartItem
                });
            } else {
                let updatedCart = await Cart.update(
                    {
                        countUniqueProduct: parseInt(productCart.countUniqueProduct) + parseInt(data.countUniqueProduct)
                    },
                    {
                        where: {
                            id: productCart.id
                        }
                    }
                );

                resolve({
                    errCode: 0,
                    message: 'update sucessfully !',
                    data: updatedCart
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getCart = (_userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let carts = await Cart.findAll({
                where: { userId: _userId }
            });

            let countItems = 0;
            carts.forEach((countItem) => {
                countItems += countItem.countUniqueProduct;
            });

            let products = [];
            for (let i = 0; i < carts.length; i++) {
                try {
                    let product = await Product.findOne({
                        where: { id: carts[i].productId },
                        raw: true
                    });
                    products.push({
                        ...product,
                        cartId: carts[i].id,
                        countUniqueProduct: carts[i].countUniqueProduct,
                        sizeOrder: carts[i].size
                    });
                } catch (error) {
                    console.log(error);
                }
            }

            resolve({
                errCode: 0,
                message: 'OK',
                countItems: countItems,
                products: products
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await Cart.update(
                { size: data.size, countUniqueProduct: data.count },
                {
                    where: {
                        id: data.id
                    }
                }
            );
            resolve({
                errCode: 0,
                message: 'done',
                data: cart
            });
        } catch (error) {
            reject(error);
        }
    });
};

let deleteCartProduct = (cartId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let productCart = await Cart.findOne({
                where: { id: cartId }
            });

            if (!productCart) {
                resolve({
                    errCode: 2,
                    message: 'Product cart is not existed'
                });
            }

            await Cart.destroy({
                where: { id: cartId }
            });

            resolve({
                errCode: 0,
                message: 'Product cart is successfully deleted !'
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewCartItem: createNewCartItem,
    getCart: getCart,
    updateCart: updateCart,
    deleteCartProduct: deleteCartProduct
};
