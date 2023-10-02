import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class PingTest extends Model<InferAttributes<PingTest>, InferCreationAttributes<PingTest>> {
  declare name: string;
}

export function PingTestInit(sequelize: Sequelize) {
  PingTest.init(
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'pingTests',
    }
  );
}
