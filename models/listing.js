'use strict';
module.exports = (sequelize, DataTypes) => {
  const listing = sequelize.define('listing', {
    listingID: {
        type: DataTypes.STRING,
        primaryKey : true
    },
    title: DataTypes.STRING
  }, {});
  listing.associate = function(models) {
    // associations can be defined here
  };
  return listing;
};