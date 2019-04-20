'use strict';
module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define("item", {
        listingID: {
            type: DataTypes.STRING,
            primaryKey : true
        },
        isbn: DataTypes.STRING,
        title: DataTypes.STRING,
        edition: DataTypes.STRING,
        author: DataTypes.STRING,
        price: DataTypes.FLOAT,
        spread: DataTypes.FLOAT,
        endTimestamp: DataTypes.INTEGER,
        auction: DataTypes.BOOLEAN,
        bin: DataTypes.BOOLEAN,
        bestOffer: DataTypes.BOOLEAN,
        seller: DataTypes.STRING,
        sellerCount: DataTypes.INTEGER
    })

    Item.associate = (models) => {
        // Item.belongsTo(models.Profile, {foreignKey: 'isbn'})
    }

    return Item
}