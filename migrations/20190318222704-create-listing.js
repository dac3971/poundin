'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: false,
        type: Sequelize.INTEGER
      },
      listingID: {
        type: Sequelize.STRING,
        allowNull : false,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull : false,
        
      },
      originalURL: {
        type: Sequelize.STRING,
        allowNull : true,

      },
      soldURL: {
        type: Sequelize.STRING,
        allowNull : true,

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
    return queryInterface.dropTable('listings');
  }
};