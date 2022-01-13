const {Model, DataTypes} = require('sequelize')
const sequelize = require('../users_database')

//User database
class User extends Model {
}
User.init({

    first_name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'user'
});

module.exports = User;