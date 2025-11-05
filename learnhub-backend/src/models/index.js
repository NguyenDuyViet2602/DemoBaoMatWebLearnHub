'use strict';

const sequelize = require('../config/db.config');
const initModels = require('./init-models');

const models = initModels(sequelize); // init all models

module.exports = {
  sequelize,
  ...models, // export từng model riêng (VD: User, Course, ...)
};
