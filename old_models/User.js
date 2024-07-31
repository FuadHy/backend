const database = require('../database.js')
const { DataTypes } = require('sequelize')

const User = database.define('user', {
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
})

module.exports = User