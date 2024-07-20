/* eslint-disable no-unused-vars */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      callsign: DataTypes.STRING,
      passwd: DataTypes.STRING,
      email: DataTypes.STRING,
      intro: DataTypes.STRING,
      mobile: DataTypes.STRING,
      address: DataTypes.STRING,
      zip: DataTypes.STRING,
      status: DataTypes.INTEGER,
      group: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'user',
      modelName: 'User',
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
        {
          unique: true,
          fields: ['email'],
        },
      ],
      defaultScope: {
        attributes: {
          exclude: ['passwd'],
          include: [[sequelize.literal(`length(passwd)=64`), 'safe']],
        },
      },
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );
  return User;
};
