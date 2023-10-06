import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  Sequelize,
} from 'sequelize';
import { User } from './User';

const tableName = 'Apps';

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
  }
};


export interface IApp {
  _id?: number;
  name: string;
  dateAdd: Date;
  users?: number[];
}

export class AppModel extends Model<InferAttributes<AppModel>, InferCreationAttributes<AppModel>> implements IApp  {
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare users: number[];
}


export function appInit(sequelize: Sequelize) {
  AppModel.init(attributes, {
    sequelize,
    tableName,
  });
}

export function relateApp() {
  AppModel.hasMany(User, {
    foreignKey: 'users',
    onDelete: 'CASCADE'
  });
}