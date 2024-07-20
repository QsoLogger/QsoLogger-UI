/* eslint-disable no-unused-vars */
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DevTabPrefixQsoLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DevTabPrefixQsoLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户ID',
      },
      userCallSign: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '己方呼号',
      },
      remoteCallSign: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '对方呼号',
      },
      userPwr: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        comment: '己方发射功率',
      },
      remotePwr: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        comment: '对方发射功率',
      },
      userQsl: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '己方QSL卡 0:不需要 1:待发 2:已发 3:已收',
      },
      remoteQsl: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '对方QSL卡 0:不需要 1:待发 2:已发 3:已收',
      },
      band: {
        type: DataTypes.STRING(255),
        defaultValue: 'WFM',
        comment: 'WFM NFM LSB USB CW',
      },
      freq: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '通信频率',
      },
      userRst: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方信号报告',
      },
      remoteRst: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方信号报告',
      },
      userGrid: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方Grid位置',
      },
      remoteGrid: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方Grid位置',
      },
      userItu: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方ITU分区',
      },
      remoteItu: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方ITU分区',
      },
      userCq: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方CQ分区',
      },
      remoteCq: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方CQ分区',
      },
      userQth: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方Qth',
      },
      remoteQth: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方Qth',
      },
      userGps: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方GPS',
      },
      remoteGps: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方GPS',
      },
      userRig: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方电台型号',
      },
      remoteRig: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方电台型号',
      },
      userAnt: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '己方天线型号',
      },
      remoteAnt: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '对方天线型号',
      },
      userComment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '用户备注',
      },
      callTimestamp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createTimestamp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      updateTimestamp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'dev_tab_prefix_qso_log',
      modelName: 'DevTabPrefixQsoLog',
      indexes: [
        {
          fields: ['userId'],
        },
        {
          fields: ['userCallSign'],
        },
        {
          fields: ['remoteCallSign'],
        },
        {
          fields: ['userQsl'],
        },
        {
          fields: ['remoteQsl'],
        },
        {
          fields: ['createTimestamp'],
        },
        {
          fields: ['updateTimestamp'],
        },
      ],
    }
  );
  return DevTabPrefixQsoLog;
};
