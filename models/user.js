const databse = require('../database')
const {DataTypes} = require('sequelize')

const User = databse.define('user', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    age: DataTypes.DECIMAL
})

module.exports = User