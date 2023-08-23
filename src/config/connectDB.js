const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ShoeShop', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = sequelize;
