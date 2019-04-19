'use strict';
module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define("profile", {
        isbn: {
            type: DataTypes.STRING,
            primaryKey : true
        },
        title: DataTypes.STRING,
        edition: DataTypes.STRING,
        author: DataTypes.STRING,
        avgPrice: DataTypes.FLOAT,
        imgURL: DataTypes.STRING,
        supply: DataTypes.INTEGER,
        demand: DataTypes.INTEGER
    })

    Profile.associate = (models) => {}

    return Profile
}