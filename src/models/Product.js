'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connectDB');

class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productGender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productStatus: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Product'
    }
);

module.exports = Product;
