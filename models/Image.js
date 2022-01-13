const {Model, DataTypes} = require('sequelize')
const sequelize = require('../users_database')

//Image database
class Image extends Model {
}
Image.init({
    url: {
        type: DataTypes.STRING
    },
    img_id: {
        type: DataTypes.MEDIUMINT
    },
    earth_date: {
        type: DataTypes.DATEONLY
    },
    sol: {
        type: DataTypes.SMALLINT
    },
    rover: {
        type: DataTypes.STRING
    },
    camera: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'image'
});

module.exports = Image;