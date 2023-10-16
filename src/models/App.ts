import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  Sequelize,
} from 'sequelize';

const tableName = 'Apps';

const attributes: ModelAttributes = {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  dateAdd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  passwordLenght: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uppercaseLetters: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  symbols: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  numbers: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  symbolsRegex: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshTokenTimeout: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
};

export interface IApp {
  _id?: number;
  name: string;
  dateAdd: Date;
  passwordLenght: number;
  uppercaseLetters: boolean;
  symbols: boolean;
  numbers: boolean;
  symbolsRegex?: string;
  refreshTokenTimeout: number;
}

export class AppModel
  extends Model<InferAttributes<AppModel>, InferCreationAttributes<AppModel>>
  implements IApp
{
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare passwordLenght: number;
  declare uppercaseLetters: boolean;
  declare symbols: boolean;
  declare numbers: boolean;
  declare symbolsRegex?: string;
  declare refreshTokenTimeout: number;
}

export function appInit(sequelize: Sequelize) {
  AppModel.init(attributes, {
    sequelize,
    tableName,
  });
}
