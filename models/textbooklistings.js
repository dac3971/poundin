'use strict';
module.exports = (sequelize, DataTypes) => {
  const textBookListings = sequelize.define('textbooklistings', {
    listingID: {
      type: DataTypes.STRING,
      primaryKey : true
  },
    title: DataTypes.STRING,
    orignalURL: DataTypes.STRING,
    soldURL: DataTypes.STRING,
    datePosted: DataTypes.STRING,
    dateSold: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    auc: DataTypes.BOOLEAN,
    bin: DataTypes.BOOLEAN,
    offer: DataTypes.BOOLEAN,
    match: DataTypes.BOOLEAN,
    seller: DataTypes.STRING,
    sellerCount: DataTypes.INTEGER
  }, {});
  textBookListings.associate = function(models) {
    // associations can be defined here
  };
  return textBookListings;
};