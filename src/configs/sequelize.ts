import { Options, Sequelize } from 'sequelize';
import { DB_URI, PRODUCTION } from '../utils/Envs';
import { pingTestInit } from '../models/PingTest';
import { appInit, relateApp } from '../models/App';
import { relateUser, userInit } from '../models/User';

const sequelizeOptions: Options = {
  ...(PRODUCTION && {
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  }),
  define: {
    timestamps: false
  }
};

export default function () {
  const seq = new Sequelize(DB_URI, sequelizeOptions);
  initTables(seq, pingTestInit, appInit, userInit);
  configRelations(relateApp, relateUser);
  return seq;
}

type RelFn = () => void;

function configRelations(...initrelationFns: RelFn[]) {
  initrelationFns.forEach((initFn) => initFn());
}

type InitFn = (sequelize: Sequelize) => void;

function initTables(sequelize: Sequelize, ...initFns: InitFn[]) {
  initFns.forEach((initFn) => initFn(sequelize));
  return sequelize;
}
