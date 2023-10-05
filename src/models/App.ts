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

export class App extends Model<InferAttributes<App>, InferCreationAttributes<App>> {
  declare _id: number;
  declare name: string;
  declare dateAdd: Date;
  declare users: number[];
}


export function appInit(sequelize: Sequelize) {
  App.init(attributes, {
    sequelize,
    tableName,
  });
}

export function relateApp() {
  App.hasMany(User, {
    foreignKey: 'users',
    onDelete: 'CASCADE'
  });
}
