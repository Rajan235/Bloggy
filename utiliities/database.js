const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("Blog", "postgres", "5533", {
	dialect: "postgres",
	host: "localhost",
})

module.exports = sequelize
