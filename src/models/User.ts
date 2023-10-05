import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  Sequelize,
} from 'sequelize';
import { App } from './App';

const tableName = 'Users';

const attributes: ModelAttributes = {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dateAdd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  password: {
    type: DataTypes.CHAR(60),
    allowNull: false
  },
  datePasswordChange: {
    type: DataTypes.DATE,
  },
  resetToken: {
    type: DataTypes.STRING(100),
  },
  dateTokenExp: {
    type: DataTypes.DATE,
  }
};

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare password: string;
  declare datePasswordChange: Date;
  declare dateTokenExp: Date;
  declare resetToken: string;
}


export function userInit(sequelize: Sequelize) {
  User.init(attributes, {
    sequelize,
    tableName,
  });
}

export function relateUser() {
  User.belongsTo(App);
}
