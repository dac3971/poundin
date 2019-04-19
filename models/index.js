const Sequelize = require("sequelize");
const config = require('../config/config.json');
const sequelize = new Sequelize('poundinpuss','postgres','testing12',{//config.database, config.username, config.password, {
  dialect: 'postgres'
});

const models = {
  profile: sequelize.import('./profile'),
  item: sequelize.import('./item')
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models
