'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connectDB');

class Cart extends Model {}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        countUniqueProduct: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        size: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Cart'
    }
);

module.exports = Cart;
