const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('test-db','image', 'pass',{
    dialect: 'sqlite',
    host: './images.sqlite'
});


module.exports = sequelize;