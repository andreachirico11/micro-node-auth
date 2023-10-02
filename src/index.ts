import { DataTypes, Sequelize } from "sequelize";
import * as express from 'express';
import {DB_URI, PRODUCTION, PORT} from './utils/Envs'
import { PingTest, PingTestInit } from "./models/PingTest";
import router from "./routes";

console.info("APP CONFIGS -----------");
console.info("PRODUCTION: ", PRODUCTION);
console.info("DB_URI: ", DB_URI);
console.info("PORT: ", PORT);
console.info("-----------------------\n\n");

const sequelize = new Sequelize(DB_URI, {...PRODUCTION && {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  }
}});
PingTestInit(sequelize);


const app = express();
app.use(router);

(async function () {
  await sequelize.sync();
  console.info("Db auth completed\n");
  app.listen(PORT, () => {
    console.info("Listening on port: " + PORT);
  });
})();
