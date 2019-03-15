const Sequelize = require("sequelize")
const db = require("../config/database")

const Puss = db.define('puss', {
    key: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    id: { type: Sequelize.STRING },
    title: { type: Sequelize.STRING },
    end: { type: Sequelize.STRING },
    price: { type: Sequelize.INTEGER },
    isbn: { type: Sequelize.STRING }
},{ tableName: 'puss'})

module.exports = Puss