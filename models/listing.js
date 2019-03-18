'use strict';
module.exports = (sequelize, DataTypes) => {
  const listing = sequelize.define('listing', {
    listingID: DataTypes.STRING
  }, {});
  listing.associate = function(models) {
    // associations can be defined here
  };
  return listing;
};