'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('textbooklistings', {
      id: {
        
        autoIncrement: true,
        
        type: Sequelize.INTEGER
      },
      listingID: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      orignalURL: {
        type: Sequelize.STRING
      },
      soldURL: {
        type: Sequelize.STRING
      },
      datePosted: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      dateSold: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      price: {
        type: Sequelize.DOUBLE
      },
      auc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      bin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      offer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      match: {
        type: Sequelize.BOOLEAN
      },
      seller: {
        type: Sequelize.STRING
      },
      sellerCount: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    console.log("sdfsdfsdf")
    return queryInterface.dropTable('textbooklistings');
  }
};