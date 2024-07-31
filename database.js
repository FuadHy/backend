const {Sequelize} = require('sequelize')

const database = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
    // dialect: 'mysql',
    // username: 'root',
    // password: 'root',
    // host: 'localhost',
    // port: 3306,
    // database: 'express'
})

module.exports = database