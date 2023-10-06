import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelAttributes,
  Sequelize,
} from 'sequelize';

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
  },
  app_id: {
    type: DataTypes.INTEGER,
  },
};

export interface IUser {
  _id: number;
  name: string;
  dateAdd: Date;
  password: string;
  datePasswordChange?: Date;
  dateTokenExp?: Date;
  resetToken?: string;
  app_id?: number;
}

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> implements IUser {
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare password: string;
  declare datePasswordChange?: Date;
  declare dateTokenExp?: Date;
  declare resetToken?: string;
  declare app_id?: number;
}


export function userInit(sequelize: Sequelize) {
  UserModel.init(attributes, {
    sequelize,
    tableName,
  });
}