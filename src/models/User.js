'use strict';
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connectDB');
const Cart = require('./Cart');
const Product = require('./Product');

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    is: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
                    msg: 'Invalid phone number !'
                }
            }
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        avatar: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
            defaultValue: null
        }
    },
    {
        sequelize,
        modelName: 'User'
    }
);

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

module.exports = User;
