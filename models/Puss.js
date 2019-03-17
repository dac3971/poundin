const Sequelize = require("sequelize")
const db = require("../config/database")

const Puss = db.define('puss', {
    id: { type: Sequelize.STRING , primaryKey: true },
    title: { type: Sequelize.STRING },
    end: { type: Sequelize.STRING },
    price: { type: Sequelize.INTEGER },
    isbn: { type: Sequelize.STRING }
},{ tableName: 'puss'})

module.exports = Puss