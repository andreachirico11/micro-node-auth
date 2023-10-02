import { Sequelize } from "sequelize";



type InitFn = (sequelize: Sequelize) => void;

export default function(sequelize: Sequelize, ...initFns: InitFn[]) {
    initFns.forEach(initFn => initFn(sequelize));
    return sequelize;
}