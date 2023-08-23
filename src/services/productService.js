import Product from '../models/Product';
import { Sequelize } from 'sequelize';

let checkProductStatus = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await Product.findOne({
                where: { id: productId }
            });
            if (product.quantity > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let createNewProduct = (data) => {
    // console.log('check data: ', data);
    return new Promise(async (resolve, reject) => {
        try {
            let product = await Product.create({
                productName: data.productName,
                image: data.image,
                size: data.size,
                color: data.color,
                price: data.price,
                quantity: data.quantity,
                description: data.description,
                category: data.category,
                productGender: data.productGender,
                productCode: data.productCode,
                productStatus: data.productStatus
            });

            // console.log('check data.productStatus: ', data.productStatus);
            // console.log('check product.productStatus: ', product.productStatus);

            if (data.productStatus === undefined) {
                let status = await checkProductStatus(product.id);
                if (status) {
                    product.productStatus = 'In Stock';
                } else {
                    product.productStatus = 'Out Stock';
                }
            }

            await product.update(
                { productStatus: product.productStatus },
                {
                    where: {
                        productStatus: undefined
                    }
                }
            );

            resolve({
                errCode: 0,
                message: 'OK',
                data: product
            });
        } catch (error) {
            console.log('error', error);
            reject(error);
        }
    });
};

let getProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = '';

            if (productId === 'ALL') {
                product = await Product.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('productCode')), 'productCode'],
                        'id',
                        'productName',
                        'image',
                        'size',
                        'color',
                        'price',
                        'quantity',
                        'description',
                        'category',
                        'productGender',
                        'productCode',
                        'productStatus'
                    ]
                });
            }

            if (productId && productId !== 'ALL') {
                product = await Product.findOne({
                    where: { id: productId }
                });
            }

            // console.log('check data product: ', product);
            resolve({
                errCode: 0,
                message: 'OK',
                data: product
            });
        } catch (error) {
            reject(error);
        }
    });
};

let deleteProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await Product.findOne({
                where: { id: productId }
            });

            if (!product) {
                resolve({
                    errCode: 2,
                    errMessage: 'Product is not existed'
                });
            }

            await Product.destroy({
                where: { id: productId }
            });

            resolve({
                errCode: 0,
                message: 'Product is successfully deleted !'
            });
        } catch (error) {
            reject(error);
        }
    });
};

let editProductData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters !'
                });
            }

            let product = await Product.findOne({
                where: { id: data.id },
                raw: false
            });
            if (product) {
                product.productName = data.productName;
                product.price = data.price;
                product.image = data.image;
                product.size = data.size;
                product.color = data.color;
                product.price = data.price;
                product.quantity = data.quantity;
                product.description = data.description;
                product.category = data.category;
                product.productGender = data.productGender;
                product.productCode = data.productCode;

                await product.save();

                resolve({
                    errCode: 0,
                    message: 'Update successfully product information !',
                    data: product
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Product is not found !'
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewProduct: createNewProduct,
    getProduct: getProduct,
    deleteProduct: deleteProduct,
    editProductData: editProductData
};
