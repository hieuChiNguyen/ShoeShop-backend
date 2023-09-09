import productService from '../services/productService';
import Product from '../models/Product';
const fs = require('fs');
const path = require('path');

let handlePostProduct = async (req, res) => {
    try {
        await Product.sync();
        let imagePath = await req.file.path;
        let productData = await productService.createNewProduct({
            ...req.body,
            image: imagePath
        });

        return res.status(200).json({
            errCode: productData.errCode,
            errMessage: productData.errMessage,
            data: productData.data ? productData.data : {}
        });
    } catch (error) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing input parameters !'
        });
    }
};

let handleGetProduct = async (req, res) => {
    let id = req.params.id; // ALL (get all products), id (get one product)

    if (!id) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Invalid Product !'
        });
    }

    let product = await productService.getProduct(id);
    return res.status(200).json(product);
};

let getProductImage = async (req, res) => {
    try {
        if (req.params.pathImage) {
            const imagePath = path.join(__dirname, `../../resources/uploads/${req.params.pathImage}`);
            const imageData = fs.readFileSync(imagePath);
            return res.end(imageData);
        } else {
            return res.status(404).json({ result: 'fail', errMessage: 'Invalid Image !' });
        }
    } catch (error) {
        return res.status(400).json({ result: 'fail', errMessage: 'Missing parameters !' });
    }
};

let handleDeleteProduct = async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Missing required parameters !'
        });
    }
    let message = await productService.deleteProduct(req.body.id);
    return res.status(200).json(message);
};

let handleEditProduct = async (req, res) => {
    let data = req.body;
    let message = await productService.editProductData(data);
    return res.status(200).json(message);
};

module.exports = {
    handlePostProduct: handlePostProduct,
    handleGetProduct: handleGetProduct,
    handleDeleteProduct: handleDeleteProduct,
    getProductImage: getProductImage,
    handleEditProduct: handleEditProduct
};
